import { useAccount, useReadContract } from "wagmi";
import { useEffect } from "react";
import { OtterAccessManagerABI } from "@/lib/abis";
import { LOCAL_ADDRESSES, ROLES } from "@/lib/contracts";
import { useOtterStore } from "@/stores/otterStore";

export function useUserRole() {
  const { address, isConnected } = useAccount();
  const { userRole, setUserRole, setIsConnected } = useOtterStore();

  // Check verifier role
  const { data: isVerifier } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAccessManager,
    abi: OtterAccessManagerABI,
    functionName: "hasRole",
    args: [ROLES.VERIFIER_ROLE as `0x${string}`, address!],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Check issuer role
  const { data: isIssuer } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAccessManager,
    abi: OtterAccessManagerABI,
    functionName: "hasRole",
    args: [ROLES.ISSUER_ROLE as `0x${string}`, address!],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Check admin role
  const { data: isAdmin } = useReadContract({
    address: LOCAL_ADDRESSES.OtterAccessManager,
    abi: OtterAccessManagerABI,
    functionName: "hasRole",
    args: [ROLES.ADMIN_ROLE as `0x${string}`, address!],
    query: {
      enabled: isConnected && !!address,
    },
  });

  useEffect(() => {
    setIsConnected(isConnected);
    if (isConnected) {
      setUserRole({
        isVerifier: Boolean(isVerifier),
        isIssuer: Boolean(isIssuer),
        isAdmin: Boolean(isAdmin),
      });
    } else {
      setUserRole({
        isVerifier: false,
        isIssuer: false,
        isAdmin: false,
      });
    }
  }, [isConnected, isVerifier, isIssuer, isAdmin, setUserRole, setIsConnected]);

  return {
    ...userRole,
    isConnected,
    address,
  };
}
