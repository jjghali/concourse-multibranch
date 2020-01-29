import { expect } from "chai";
import { JobTransformer } from "../src/jobtranformer";
import { BitbucketServerAdapter } from "../src/gitAdapters";
const YAML = require("yaml");

describe("JobTransformer", () => {
  describe("generatePipeline", () => {
    it("should return the new pipeline", () => {
      let jbt: JobTransformer = new JobTransformer(
        "template.pipeline.yml",
        "template",
        "TMQ",
        "maah-code"
      );

      console.log(YAML.stringify(jbt.generatePipeline(["branch1", "branch2"])));
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
