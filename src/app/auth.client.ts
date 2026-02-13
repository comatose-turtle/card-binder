export default function getStubAuth(): Promise<{
  userId: string;
}> {
    return new Promise((resolve) => {
        resolve({
            userId: "comatoseturtle",
        });
    });
}