import { expect } from "chai";
import { JobTransformer } from "../src/jobtranformer";
import { BitbucketCloudAdapter } from "../src/gitAdapters";

// describe("JobTransformer", () => {
//   describe("generatePipeline", () => {
//     it("should return the new pipeline", () => {
//       let jbt: JobTransformer = new JobTransformer(
//         "./concourse-test.yml",
//         "template"
//       );

//       jbt.generatePipeline(["branche1", "branche2"]);
//     });
//   });
// });

describe("BitbucketCloud", () => {
  describe("branchAvailable", () => {
    it("should return available branches", () => {
      BitbucketCloudAdapter.getBranches(
        "joshuaghali-gologic",
        "concourse-branch-test",
        "",
        ""
      );
    });
  });
});
