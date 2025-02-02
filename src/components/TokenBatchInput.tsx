"use client";
import { SetStateAction, useEffect, useState } from "react";
import { publicClient, walletClient } from "@/utils/config";
import { useAccount } from "wagmi";
import BatchingABI from "@/utils/BatchingABI.json";
import { Address, erc20Abi, parseEther } from "viem";
import toast from "react-hot-toast";

export const TokenBatchInput = () => {
  const { address: walletAddress, isConnected } = useAccount();
  const CONTRACT_ADDRESS = "0xE6BFBB88b579ed198ddeC485abaBb8f5a556666F";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [values, setValues] = useState<string>("");
  const [valuesArray, setValuesArray] = useState<string[]>([]);

  const [addresses, setAddresses] = useState<string>("");
  const [addressesArray, setAddressesArray] = useState<string[]>([]);

  const handleValueChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setValues(e.target.value);
  };

  const handleAddressesChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setAddresses(e.target.value);
  };

  const sendTransaction = async () => {
    const tokenDecimals = await publicClient.readContract({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: "decimals",
    });
    const tokenValueArray: bigint[] = valuesArray.map((value) =>
      tokenDecimals == 18
        ? parseEther(value)
        : BigInt(Number(value) * 10 ** tokenDecimals)
    );
    const totalValue = tokenValueArray.reduce(
      (acc, cur) => acc + cur,
      BigInt(0)
    );

    if (valuesArray.length !== addressesArray.length) {
      toast.error("The number of addresses must match the number of values");
      return;
    }
    if (valuesArray.length < 1 || addressesArray.length < 1 || !tokenAddress) {
      toast.error("Please fill all the fields");
      return;
    }

    setIsLoading(true);

    const allowance = await publicClient.readContract({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [walletAddress as Address, CONTRACT_ADDRESS],
    });

    if (allowance < totalValue) {
      const { request } = await publicClient.simulateContract({
        account: walletAddress,
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [
          CONTRACT_ADDRESS as Address,
          parseEther("100000000000000000000"),
        ],
      });
      await walletClient.writeContract(request);
    }

    try {
      const { request } = await publicClient.simulateContract({
        account: walletAddress,
        address: CONTRACT_ADDRESS,
        abi: BatchingABI,
        functionName: "batchTokenTransactions",
        args: [tokenAddress, addressesArray, tokenValueArray],
      });
      console.log(request);
      await walletClient
        .writeContract(request)
        .then(() =>
          toast.success(
            "Transaction Successful, recipients will receive amount soon"
          )
        );
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const array = values
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setValuesArray(array);
  }, [values]);

  useEffect(() => {
    const array = addresses
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setAddressesArray(array);
  }, [addresses]);

  return (
    <>
      <h1 className="text-center text-xl py-4 mt-5">Token Batch Transaction</h1>
      <div className="flex justify-center gap-4 mt-5">
        {isConnected && walletAddress ? (
          <button
            className="btn btn-active btn-neutral w-2/5"
            onClick={sendTransaction}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                Send Transaction
                <ArrowButton />
              </>
            )}
          </button>
        ) : (
          <button className="disable btn btn-active btn-neutral w-2/5">
            Please connect wallet first
          </button>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-5">
        <input
          onChange={(e) => setTokenAddress(e.target.value)}
          type="text"
          placeholder="Token Address"
          className="input input-bordered w-2/5"
        />
      </div>
      <div className="flex justify-center gap-4">
        <div className="flex flex-col mt-5">
          <div className="">
            <h1 className="text-lg">Addresses</h1>
            <label className="form-control w-full max-w-xs">
              <textarea
                value={addresses}
                onChange={handleAddressesChange}
                placeholder="Add the recipient addresses"
                className="textarea textarea-bordered h-24"
              />
              <div className="label">
                <span className="label-text-alt">
                  Separate addresses by ,(comma)
                </span>
              </div>
            </label>
          </div>
          <div className="">
            <div className="mockup-code max-h-30 overflow-y-auto">
              {addressesArray.map((item, index) => (
                <pre key={index} data-prefix=">">
                  <code>
                    {index}: {item}
                  </code>
                </pre>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <div className="">
            <h1 className="text-lg">Values</h1>
            <label className="form-control w-full max-w-xs">
              <textarea
                value={values}
                onChange={handleValueChange}
                placeholder="Add Token values"
                className="textarea textarea-bordered h-24"
              />
              <div className="label">
                <span className="label-text-alt">
                  Separate addresses by ,(comma)
                </span>
              </div>
            </label>
          </div>
          <div className="">
            <div className="mockup-code max-h-30 overflow-y-auto">
              {valuesArray.map((item, index) => (
                <pre key={index} data-prefix=">">
                  <code>
                    {index}: {item}
                  </code>
                </pre>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ArrowButton = () => {
  return (
    <svg
      fill="#fff"
      className="h-6 w-6"
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z"
        fillRule="nonzero"
      />
    </svg>
  );
};
