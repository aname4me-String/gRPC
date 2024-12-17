const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const readline = require("readline");
const { format } = require("date-fns");

const PROTO_PATH = "./election.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const electionProto = grpc.loadPackageDefinition(packageDefinition).ElectionDataService;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to get user input as a promise
const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Main function to run the client
async function run() {
    const client = new electionProto("localhost:50051", grpc.credentials.createInsecure());

    try {
        const regionID = await askQuestion("Region ID: ");
        const regionName = await askQuestion("Region Name: ");
        const regionAddress = await askQuestion("Region Address: ");
        const regionPostalCode = await askQuestion("Region Code: ");
        const federalState = await askQuestion("Region State: ");
        const oevpVotes = await askQuestion("oevp votes: ");
        const spoeVotes = await askQuestion("spoe votes: ");
        const fpoeVotes = await askQuestion("fpoe votes: ");
        const grueneVotes = await askQuestion("gruene votes: ");
        const neosVotes = await askQuestion("neos votes: ");
        const timestamp = format(new Date(), "MM/dd/yyyy, HH:mm:ss");

        const electionData = {
            regionID: regionID,
            regionName: regionName,
            regionAddress: regionAddress,
            regionPostalCode: regionPostalCode,
            federalState: federalState,
            oevpVotes: parseInt(oevpVotes),
            spoeVotes: parseInt(spoeVotes),
            fpoeVotes: parseInt(fpoeVotes),
            grueneVotes: parseInt(grueneVotes),
            neosVotes: parseInt(neosVotes),
            timetstamp: timestamp,
        };

        client.sendElectionData(electionData, (error, response) => {
            if (error) {
                console.error("Error occurred:", error.message);
            } else {
                console.log("Client received:", response.message);
            }
            rl.close();
        });
    } catch (err) {
        console.error("Error during input collection:", err.message);
        rl.close();
    }
}

run();
