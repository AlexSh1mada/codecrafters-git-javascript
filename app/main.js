const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// You can use print statements as follows for debugging, they'll be visible when running tests.
//console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const command = process.argv[2];

switch (command) {
   case "init":
     createGitDirectory();
     break;
    case "cat-file": 
      const subCommand = process.argv[3];
      const objectSha = process.argv[4];
      if (subCommand == '-p' && objectSha) {
        readBlob(objectSha);
      } else {
        throw new Error(`Subcommand ${command} unknown or missing arguments`);
      }
      break;
   default:
     throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
   fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
   fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
   fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

   fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
   console.log("Initialized git directory");
}

function readBlob(objectSha) {
  const objectDir = path.join(process.cwd(), ".git", "objects", objectSha.slice(0, 2));
  const objectFile = path.join(objectDir, objectSha.slice(2));

  // Read the compressed object file
  const compressedData = fs.readFileSync(objectFile);

  // Decompress the object file using zlib
  const decompressedData = zlib.inflateSync(compressedData);
  const response = decompressedData.toString().split('\x00')[1];

  // Print the response without adding a new line
  process.stdout.write(response);
}
