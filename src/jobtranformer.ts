import BranchPipeline from './branchPipeline'

const fs = require('fs');
const sha1 = require('sha1');
const YAML = require('yaml')
const path = require('path');


export class JobTransformer {
    private TEMPLATE_JOB_GROUP: string = 'templateJob';
    private BRANCHES_JOB_GROUP: string = 'branchesJobs';

    private parsedPipeline: any;
    private templateJob: any;
    private pipelineHash: string = "";
    private pipelineName: string = "";
    private gitResource: any;

    constructor(pipelineFilePath: string, templateJobName: string) {
        const file = fs.readFileSync(pipelineFilePath, 'utf8');

        this.parsedPipeline = YAML.parse(file);
        this.pipelineName = path.basename(pipelineFilePath).replace(".yml", "");
        this.getTemplateJob(templateJobName);
        this.getGitResource();
    }


    private getTemplateJob(templateJobName: string): void {
        this.templateJob = this.parsedPipeline.jobs.find((i: any) => {
            if (templateJobName != "")
                return i.name == templateJobName;
            else
                return i.name.includes('template');
        });
    }

    private getGitResource(): void {
        this.gitResource = this.parsedPipeline.resources.find((r: any) => {
            return r.type == 'git' && r.source.branch == 'master';
        });
    }

    generatePipeline(branches: string[]): any {
        let newPipeline: BranchPipeline = new BranchPipeline();

        let resources: Array<any> = new Array<any>();
        let jobs: Array<any> = new Array<any>();
        let groups: Array<any> = this.initGroups();

        jobs.push(this.templateJob);
        let gitName = this.gitResource.name;

        branches.forEach((b) => {
            // for (let i = 0; i < branches.length; ++i) {
            // let b = branches[i];
            let gitResourceNane: string = ""

            gitResourceNane += gitName;
            gitResourceNane += '_' + b;
            let jobName = this.templateJob.name + "_" + b;

            let tempJob: any = this.createJobForBranch(gitResourceNane, jobName)
            let tempGitResource = this.createGitResourceForBranch(b, gitResourceNane);

            // console.log(b)
            console.log("resource=" + gitResourceNane);
            console.log(gitName)

            jobs.push(tempJob);
            resources.push(tempGitResource);

            groups.find((g) => {
                return g.name == this.BRANCHES_JOB_GROUP;
            }).jobs.push(jobName);
            gitResourceNane = "";
        })

        let finalPipeline: any = this.finalizePipeline(resources, jobs, groups);

        newPipeline.name = this.pipelineName
            + "_" + this.pipelineHash;
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
        let originalGroup: any = { name: this.TEMPLATE_JOB_GROUP, jobs: [this.templateJob.name] };
        let branchesJobGroup: any = { name: this.BRANCHES_JOB_GROUP, jobs: [] };

        groups.push(originalGroup);
        groups.push(branchesJobGroup);

        return groups;
    }

    private createJobForBranch(gitResourceNane: string, jobName: string): any {
        let tempJob: any = this.templateJob;
        // let gitResource = this.getGitResource();
        tempJob.name = jobName;

        let tempJobPlanIdx = tempJob.plan.findIndex((p: any) => {
            return p.get == this.gitResource.name;
        });

        let tmpjp = tempJob.plan[tempJobPlanIdx];
        tmpjp.get = gitResourceNane;
        tempJob.plan[tempJobPlanIdx] = tmpjp;

        console.log(JSON.stringify(tempJob));

        if (tempJob.plan.some((p: any) => {
            return p.put == this.gitResource.name;
        })) {
            tempJob.plan.find((p: any) => {
                return p.put == this.gitResource.name;
            }).put = gitResourceNane;
        }
    }

    private createGitResourceForBranch(branch: string, gitResourceName: string): any {
        let tempGitResource = this.gitResource;
        tempGitResource.name += '_' + branch;
        tempGitResource.source.branch = gitResourceName;
        return tempGitResource;
    }

    private updateGroups() {

    }

    private changeGitBranch(): void {

    }


}

