import React from "react";
import { ERC20ABI, ERC20Address, MinerTokenABI, MinerTokenAddress } from "src/services/contractAbi";
import { useAccount, useContractWrite } from "wagmi";
import Loading from "./loading";

export function MintButton() {
    const { address, isConnecting, isDisconnected } = useAccount()
    // approve first and then stake
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: ERC20Address,
        abi: ERC20ABI,
        functionName: 'approve',
        onSuccess(data) {
            alert('Successful! \n'+ "transaction hash: " + JSON.stringify(data).split(":")[1].split("\"")[1])
            
        },
        onError(error) {
            console.log(error)
        },
    })

    const { data: data2, isLoading: isLoading2, isSuccess: isSuccess2, write: write2 } = useContractWrite({
        address: MinerTokenAddress,
        abi: MinerTokenABI,
        functionName: 'register',
        onSuccess(data) {
            alert('Successful! \n'+ "transaction hash: " + JSON.stringify(data).split(":")[1].split("\"")[1])
            
        },
        onError(error) {
            console.log(error)
        },
    })

    if(!isDisconnected){
        return (
            <div>
                <div>
                    {/** if isSuccess show another button */}
                    {isSuccess ? 
                    <button
                    className="btn join-item input-bordered input-info rounded"
                    type="button"
                    disabled={!write2}
                    onClick={() => {
                      write2({
                          args: [500000000000000000000,address],
                      })
                    }}
                    style={{"borderRadius": "30px", "minWidth": "0px", "marginTop": "10px"}}
                    >Register</button>:<button
                    className="btn join-item input-bordered input-info rounded"
                    type="button"
                    disabled={!write}
                    onClick={() => {
                      write({
                          args: [MinerTokenAddress, 500000000000000000000],
                      })
                    }}
                    style={{"borderRadius": "30px", "minWidth": "0px", "marginTop": "10px"}}
                    >Approve</button>
                    }
                    
                </div>
                
                <div>
                {isLoading && <Loading />}
                </div>

            </div>
            
        )
    }else{
        return (
            <div>
                <p>You have to connect wallet!</p>
            </div>
        )
    }

}