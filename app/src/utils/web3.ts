import { useReadContract } from "wagmi";
import { ERC20_ABI } from "./contracts";

// Function to read data from your contract
export function useContractData(
	functionName: string,
	contractAddress: `0x${string}`,
	...args: any[]
) {
	return useReadContract({
		address: contractAddress,
		abi: ERC20_ABI,
		functionName: functionName as any,
		args: args as any,
	});
}

// Function to write data to your contract
//   export function useContractMutation(functionName: string, contractAddress: `0x${string}`, ...args: any[]): any {
// 	const {writeContract, data: hash, failureReason } = useWriteContract()
//     const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     })
//     writeContract({
//         address: contractAddress,
//         abi: ERC20_ABI,
//         functionName: functionName,
//         args: args,
//       });

//     }
