import YAML from 'yaml'
import sha1 from 'sha1';
import BranchPipeline from './branchPipeline'

class JobTransformer {
    private TEMPLATE_JOB_GROUP: string = 'templateJob';
    private BRANCHES_JOB_GROUP: string = 'branchesJobs';

    private parsedPipeline: any;
    private templateJob: any;
    private gitResource: any;
    private newPipelines: BranchPipeline[] = new Array<BranchPipeline>();
    private pipelineHash: string = "";
    private pipelineName: string = "";
    private groups: any;

    constructor(pipeline: string, pipelineName: string, templateJobName: string) {
        this.parsedPipeline = YAML.parse(pipeline);
        this.pipelineName = pipelineName;
        this.getTemplateJob(templateJobName);
        this.getGitResource();
        this.groups = new Array<any>();

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

    private addJobsPerBranch(branches: string[]): void {
        let newPipeline: BranchPipeline = new BranchPipeline();

        let resources: Array<any> = new Array<any>();
        let jobs: Array<any> = new Array<any>();
        let groups: Array<any> = this.initGroups();


        branches.forEach((b) => {
            let gitResourceNane: string = this.gitResource + '_' + b;
            let jobName = this.templateJob.name + "_" + b;

            let tempJob: any = this.createJobForBranch(gitResourceNane, jobName)
            let tempGitResource = this.createGitResourceForBranch(b, gitResourceNane);

            jobs.push(tempJob);
            resources.push(tempGitResource);

            groups.find((g) => {
                return g.name == this.BRANCHES_JOB_GROUP;
            }).jobs.push(jobName);
        });

        let finalPipeline: any = this.finalizePipeline(resources, jobs, groups);

        newPipeline.name = this.pipelineName
            + "_" + this.pipelineHash;
        newPipeline.hash = this.pipelineHash;
        newPipeline.content = finalPipeline;
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

        tempJob.name = jobName

        tempJob.plan.find((p: any) => {
            return p.get == this.gitResource.name;
        }).get = gitResourceNane;

        if (tempJob.plan.any((p: any) => {
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

export JobTransformer;