using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ScenarioRunner {
    class Program {
        static int Main(string[] args) {
            var testDirectory = args[3];
            var phantomArgs = Aggregate(args.Take(4).ToArray());
            var optionalArgs = args.Length > 4 ? Aggregate(args.Skip(4).ToArray()) : "";

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
            });

            Console.WriteLine("{0} scenario(s) run - {1} failure(s)", tests.Length, failureCount);

            return failureCount == 0 ? 0 : 1;
        }

        static string Aggregate(params string[] args) {
            return args.Aggregate((x, y) => x + " " + y);
        }
    }
}