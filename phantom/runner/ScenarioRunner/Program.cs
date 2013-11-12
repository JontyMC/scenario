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

            var failureCount = 0;
            var tests = Directory.GetFiles(testDirectory + "\\", "*.js", SearchOption.AllDirectories)
                .Select(Path.GetFileNameWithoutExtension)
                .ToArray();

            Console.WriteLine("Running {0} scenario(s)\n", tests.Length);

            Parallel.ForEach(tests, test => {
                var process = new Process {
                    StartInfo = {
                        FileName = "phantomjs.exe",
                        Arguments = Aggregate(phantomArgs, test, Aggregate(args.Skip(4).ToArray())),
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    }
                };

                process.Start();

                var output = process.StandardOutput.ReadToEnd();
                var error = process.StandardError.ReadToEnd();
                process.WaitForExit();
                var result = process.ExitCode;
                if (result == 1) {
                    failureCount++;
                }
                if (!string.IsNullOrEmpty(error)) {
                    Console.WriteLine("PhantomJS ERROR:");
                    Console.Write(error + "\n");
                }
                if (!string.IsNullOrEmpty(output)) {
                    Console.Write(output + "\n");
                }
            });

            Console.WriteLine("{0} scenario(s) run - {1} failure(s)", tests.Length, failureCount);

            return failureCount == 0 ? 0 : 1;
        }

        static string Aggregate(params string[] args) {
            return args.Aggregate((x, y) => x + " " + y);
        }
    }
}