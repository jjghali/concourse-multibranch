import { expect } from "chai";
import { JobTransformer } from "../src/jobtranformer";
import { BitbucketServerAdapter } from "../src/gitAdapters";
import YAML from "yaml";

describe("JobTransformer", () => {
  describe("generatePipeline", () => {
    it("should return the new pipeline", () => {
      let jbt: JobTransformer = new JobTransformer(
        "pipeline-exemple.yml",
        "template",
        "***REMOVED***",
        "demo-application-java"
      );

      console.log(
        YAML.stringify(jbt.generatePipeline(["branche1", "branche2"]))
      );
    });
  });
});

// describe("BitbucketCloud", () => {
//   describe("branchAvailable", () => {
//     it("should return available branches", () => {
//       BitbucketServerAdapter.getBranches(
//         "http://172.16.197.129:7990",
//         "TMQ",
//         "maaah-code",
//         "jjghali",
//         "MDUwOTkyNzY2MzIwOkpf4FhvlTQXIDKL/wc0neeiu/n2"
//       ).then((branches: any) => {
//         branches.forEach((b: string) => {
//           console.log(b);
//         });
//       });

//       expect(true);
//     });
//   });
// });
