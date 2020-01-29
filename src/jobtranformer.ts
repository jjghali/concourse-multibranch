import BranchPipeline from "./branchPipeline";
import deepcopy from "ts-deepcopy";
import { Job } from "./Job";

const fs = require("fs");
const sha1 = require("sha1");
const YAML = require("yaml");
const path = require("path");

export class JobTransformer {
  private TEMPLATE_JOB_GROUP: string = "templateJob";
  private BRANCHES_JOB_GROUP: string = "branchesJobs";

  private parsedPipeline: any;
  private templateJob: Job = new Job();
  private pipelineHash: string = "";
  private pipelineName: string = "";
  private gitResource: any;

  constructor(
    pipelineFilePath: string,
    templateJobName: string,
    project: string,
    reposSlug: string
  ) {
    const file = fs.readFileSync(pipelineFilePath, "utf8");

    this.parsedPipeline = YAML.parse(file);
    this.pipelineName = path.basename(pipelineFilePath).replace(".yml", "");
    this.getTemplateJob(templateJobName);
    this.getGitResource(project, reposSlug);
  }

  private getTemplateJob(templateJobName: string): void {
    this.templateJob = this.parsedPipeline.jobs.find((i: any) => {
      if (templateJobName != "") return i.name == templateJobName;
      else return i.name.includes("template");
    });
  }

  private getGitResource(project: string, reposSlug: string): void {
    const gitResourceExist = (r: any) => {
      return (
        r.type == "git" &&
        r.source.uri.includes(project) &&
        r.source.uri.includes(reposSlug)
      );
    };

    this.gitResource = this.parsedPipeline.resources.find(gitResourceExist);
  }

  generatePipeline(branches: string[]): any {
    let newPipeline: BranchPipeline = new BranchPipeline();

    let resources: Array<any> = new Array<any>();
    let jobs: Array<any> = new Array<any>();
    let groups: Array<any> = this.initGroups();

    jobs.push(this.templateJob);
    resources.push(this.gitResource);

    branches.forEach(b => {
      let gitResourceNane: string = "git_" + b;
      let jobName = "job_" + b;

      let tempJob: any = this.createJobForBranch(b);
      let tempGitResource = this.createGitResourceForBranch(b, gitResourceNane);

      jobs.push(tempJob);
      resources.push(tempGitResource);

      groups
        .find(g => {
          return g.name == this.BRANCHES_JOB_GROUP;
        })
        .jobs.push(jobName);
    });

    let finalPipeline: any = this.finalizePipeline(resources, jobs, groups);

    newPipeline.name = this.pipelineName + "_" + this.pipelineHash;
    newPipeline.hash = this.pipelineHash;
    newPipeline.content = finalPipeline;
    return finalPipeline;
  }

  private finalizePipeline(resources: any, jobs: any, groups: any): any {
    let pipeline: any = {
      resources: resources,
      jobs: jobs,
      groups: groups
    };
    return pipeline;
  }

  private initGroups(): Array<any> {
    let groups: Array<any> = new Array<any>();
    let originalGroup: any = {
      name: this.TEMPLATE_JOB_GROUP,
      jobs: [this.templateJob.name]
    };
    let branchesJobGroup: any = { name: this.BRANCHES_JOB_GROUP, jobs: [] };

    groups.push(originalGroup);
    groups.push(branchesJobGroup);

    return groups;
  }

  private createJobForBranch(branch: string): any {
    if (this.gitResource != null) {
      let tempJob: any = deepcopy<Job>(this.templateJob);

      let gitResourceName: string = "git_" + branch;
      tempJob.name = "job_" + branch;
      tempJob = this.replace(this.gitResource.name, gitResourceName, tempJob);

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
    let tempGitResource = deepcopy<any>(this.gitResource);
    tempGitResource.name = gitResourceName;
    tempGitResource.source = deepcopy<any>(this.gitResource.source);
    tempGitResource.source.branch = branch;
    return tempGitResource;
  }

  private replace(entry: string, newEntry: string, object: Job): Object {
    let entries = Object.entries(object);
    let result: Array<any> = new Array<any>();
    let sEntry: any = JSON.stringify(object)
      .split(entry)
      .join(newEntry);

    // entries.forEach((e: any) => {
    //   sEntry = JSON.stringify(e)
    //     .split(entry)
    //     .join(newEntry);
    //   result.push(JSON.parse(sEntry));
    // });

    return JSON.parse(sEntry);
  }
}
