import React from "react";
import { ERC20ABI, ERC20Address } from "src/services/contractAbi";
import { useAccount, useContractWrite } from "wagmi";
import Loading from "./loading";

export function MintButton() {
    const { address, isConnecting, isDisconnected } = useAccount()

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: ERC20Address,
        abi: ERC20ABI,
        functionName: 'mint',
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
                    {<button
                    className="btn join-item input-bordered input-info rounded"
                    type="button"
                    disabled={!write}
                    onClick={() => {
                      write({
                          args: [address],
                      })
                    }}
                    style={{"borderRadius": "30px", "minWidth": "0px", "marginTop": "10px"}}
                    >Mint</button>}
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