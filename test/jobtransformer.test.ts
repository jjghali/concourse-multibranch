import { expect } from "chai";
import { JobTransformer } from '../src/jobtranformer'

describe("JobTransformer", () => {
    describe("generatePipeline", () => {
        it("should return the new pipeline", () => {
            let jbt: JobTransformer = new JobTransformer('./concourse-test.yml', 'template');


            jbt.generatePipeline(['branche1', 'branche2'])
        });
    });
});

