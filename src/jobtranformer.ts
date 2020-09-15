import BranchPipeline from "./branchPipeline";
import deepcopy from "ts-deepcopy";
import { Job } from "./Job";

const fs = require("fs");
const YAML = require("yaml");
const path = require("path");

export class JobTransformer {
  private BRANCHES_JOB_GROUP: string = "branchesJobs";

  private parsedPipeline: any;
  private templateJob: Job = new Job();
  private pipelineHash: string = "";
  private pipelineName: string = "";
  private gitResource: any;
  private originalGitResources: Array<any> = Array<any>();
  private resourceTypes: any;


  constructor(
    pipelineFilePath: string,
    templateJobName: string,
    gitResourceName: string
  ) {
    const file = fs.readFileSync(pipelineFilePath, "utf8");
    this.parsedPipeline = YAML.parse(file);
    this.pipelineName = path.basename(pipelineFilePath).replace(".yml", "");
    this.getTemplateJob(templateJobName);
    this.getGitResource(gitResourceName);
    this.getResourceTypes();
  }

  private getTemplateJob(templateJobName: string): void {
    this.templateJob = this.parsedPipeline.jobs.find((i: any) => {
      if (templateJobName != "") return i.name == templateJobName;
      else return i.name.includes("template");
    });
  }

  private getGitResource(
    gitResourceName: string
  ): void {

    this.parsedPipeline.resources.forEach((res: any) => {
      if (!res.name.includes("git_"))
        this.originalGitResources.push(deepcopy<any>(res));
    });

    this.gitResource = this.parsedPipeline.resources.find((r: any) => {
      return r.type == "git" && r.name == gitResourceName;
    });
  }

  private getResourceTypes(): void {
    this.resourceTypes = deepcopy<any>(this.parsedPipeline.resource_types);
    console.log(this.resourceTypes)
  }


  generatePipeline(branches: string[]): any {
    let newPipeline: BranchPipeline = new BranchPipeline();

    let jobs: Array<any> = this.parsedPipeline.jobs.filter((j: any) => {
      return !j.name.includes("job_")
    });
    let groups: Array<any> = this.initGroups();



    branches.forEach(b => {
      let gitResourceNane: string = "git_" + b;
      let jobName = "job_" + b;

      let tempJob: any = this.createJobForBranch(b);
      let tempGitResource = this.createGitResourceForBranch(b, gitResourceNane);

      jobs.push(tempJob);
      this.originalGitResources.push(tempGitResource);

      groups
        .find(g => {
          return g.name == this.BRANCHES_JOB_GROUP;
        })
        .jobs.push(jobName);
    });

    let finalPipeline: any = this.finalizePipeline(
      this.originalGitResources,
      jobs,
      groups
    );

    newPipeline.name = this.pipelineName + "_" + this.pipelineHash;
    newPipeline.hash = this.pipelineHash;
    newPipeline.content = finalPipeline;
    return finalPipeline;
  }

  private finalizePipeline(resources: any, jobs: any, groups: any): any {
    let pipeline: any = {
      resources: resources,
      resource_types: this.parsedPipeline.resource_types,
      jobs: jobs,
      groups: groups
    };
    return pipeline;
  }

  private initGroups(): Array<any> {
    let groups: Array<any> = this.parsedPipeline.groups;

    if (!groups.some(g => {
      return g.name == this.BRANCHES_JOB_GROUP;
    })) {
      groups.push({
        name: this.BRANCHES_JOB_GROUP
      })
    }
    groups
      .find(g => {
        return g.name == this.BRANCHES_JOB_GROUP;
      })
      .jobs = new Array<any>();
    return groups;
  }

  private createJobForBranch(branch: string): any {
    if (this.gitResource != null) {
      let tempJob: any = deepcopy<Job>(this.templateJob);

      let gitResourceName: string = "git_" + branch;
      tempJob.name = "job_" + branch;
      tempJob = this.replace(this.gitResource.name, gitResourceName, tempJob);

      let sJobTemplate = JSON.stringify(tempJob);
      while (sJobTemplate.includes(this.gitResource.name)) {
        sJobTemplate.replace(this.gitResource.name, gitResourceName);
      }

      tempJob = JSON.parse(sJobTemplate);

      let tempJobPlanIdx = tempJob.plan.findIndex((p: any) => {
        return p.get == this.gitResource.name;
      });

      let tmpjp: any;

      if (tempJobPlanIdx != -1) {
        let tmpjp = tempJob.plan[tempJobPlanIdx];
        tmpjp.get = gitResourceName;
        tempJob.plan[tempJobPlanIdx] = tmpjp;
      }
      tempJobPlanIdx = tempJob.plan.findIndex((p: any) => {
        return p.put == this.gitResource.name;
      });
      if (tempJobPlanIdx != -1) {
        tmpjp = tempJob.plan[tempJobPlanIdx];
        tmpjp.put = gitResourceName;
        tempJob.plan[tempJobPlanIdx] = tmpjp;
      }

      return tempJob;
    } else return null;
  }

  private createGitResourceForBranch(
    branch: string,
    gitResourceName: string
  ): any {
    let tempGitResource: any = deepcopy<any>(this.gitResource);
    tempGitResource.name = gitResourceName;
    tempGitResource.source = deepcopy<any>(this.gitResource.source);
    tempGitResource.source.branch = branch;
    return tempGitResource;
  }

  private replace(entry: string, newEntry: string, object: Job): Object {
    let sEntry: any = JSON.stringify(object)
      .split(entry)
      .join(newEntry);
    return JSON.parse(sEntry);
  }
}