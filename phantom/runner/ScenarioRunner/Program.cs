using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RazorEngine;

namespace ScenarioRunner {
    class Program {
        static int Main(string[] args) {
            var htmlPage = args[2];
            var testDirectory = args[3];
            var phantomArgs = Aggregate(args.Take(4).ToArray());
            var optionalArgs = args.Length > 4 ? Aggregate(args.Skip(4).ToArray()) : "";
            var useJsonReporter = args.Any(x => x == "--json-reporter");
            var testResults = new ConcurrentBag<Scenario>();
            var createHtmlReport = args.Any(x => x.StartsWith("--domain="));

            var failureCount = 0;
            var tests = Directory.GetFiles(testDirectory + "\\", "*.js", SearchOption.AllDirectories)
                .Select(x => {
                    var testName = Path.GetFileNameWithoutExtension(x);
                    var directoryName = Path.GetDirectoryName(x);
                    if (directoryName != null) {
                        testName = directoryName.Replace("\\", "/") + "/" + testName;
                    }
                    return testName;
                })
                .ToArray();

            Console.WriteLine("Running {0} scenario(s)\n", tests.Length);

            Parallel.ForEach(tests, test => {
                var phantomArgsForTest = Aggregate(phantomArgs, "\"" + test + "\"", optionalArgs);

                Console.WriteLine("Running test with args: " + phantomArgsForTest);
                var process = new Process {
                    StartInfo = {
                        FileName = "phantomjs.exe",
                        Arguments = phantomArgsForTest,
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    }
                };

                process.Start();

                var output = process.StandardOutput.ReadToEnd();
                var error = process.StandardError.ReadToEnd();

                process.WaitForExit(5000);

                if (process.ExitCode == 1) {
                    output = "FAILURE! " + test + "\n" + output + "\n" + error;
                    failureCount++;
                }

                Console.Write(output + "\n");

                if (!useJsonReporter) return;

                DeseralizeScenarioFromJsonReporter(output, testResults);
            });

            Console.WriteLine("{0} scenario(s) run - {1} failure(s)", tests.Length, failureCount);

            if (createHtmlReport) {
                var domain = args.Single(x => x.StartsWith("--domain=")).Substring(9);
                var results = testResults.OrderBy(x => x.Id).ToArray();
                CreateHtmlReport(domain, htmlPage, results);
            }

            return failureCount == 0 ? 0 : 1;
        }

        static void CreateHtmlReport(string domain, string htmlPage, Scenario[] scenarios) {
            var template = File.ReadAllText("Template.cshtml");
            var html = Razor.Parse(template, new { Domain = domain, HtmlPage = htmlPage, Scenarios = scenarios });
            File.WriteAllText("../scenarios.html", html);
        }

        static void DeseralizeScenarioFromJsonReporter(string output, ConcurrentBag<Scenario> testResults) {
            var start = output.IndexOf("##jsonBegin", StringComparison.Ordinal);
            var end = output.IndexOf("##jsonEnd", StringComparison.Ordinal);

            if (start == -1 || end == -1) return;

            var result = output.Substring(start + 11, end - start - 11);
            testResults.Add(JsonConvert.DeserializeObject<Scenario>(result));
        }

        static string Aggregate(params string[] args) {
            return args.Aggregate((x, y) => x + " " + y);
        }
    }

    public class Scenario {
        public string Id { get; set; }
        public string Title { get; set; }
        public StepFailed Error { get; set; }
        public Step[] Steps { get; set; }
    }

    public class Step {
        public string Title { get; set; }
        public StepFailed Error { get; set; }
    }

    public class StepFailed {
        public string Message { get; set; }
        public string Stack { get; set; }
        public string Type { get; set; }
    }
}