export default class BranchPipeline {
    public name: string = ""; // name will look like this: branchname_originalPipelineName_hashShort
    public hash: string = ""; // hash is used to verify if the pipeline changed
    public content: any;
}

