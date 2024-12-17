import grpc
import election_pb2
import election_pb2_grpc
from datetime import datetime

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = election_pb2_grpc.ElectionDataServiceStub(channel)
        response = stub.sendElectionData(election_pb2.ElectionData(
            regionID=input("Region ID: "),
            regionName=input("Region Name: "),
            regionAddress=input("Region Adresse: "),
            regionPostalCode=input("Region Code: "),
            federalState=input("Region state: "),
            oevpVotes=int(input("oevp votes: ")),
            spoeVotes=int(input("spoe votes: ")),
            fpoeVotes=int(input("fpoe votes: ")),
            grueneVotes=int(input("gruene votes: ")),
            neosVotes=int(input("neos votes: ")),
            timetstamp=datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        ))
        print("Greeter client received: " + response.message)

if __name__ == "__main__":
    run()
