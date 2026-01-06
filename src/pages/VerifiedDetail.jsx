import React from "react";
import { useParams } from "react-router-dom";
import useGetVerifiedDetail from "../hooks/verifiedbadge/useGetVerifiedDetail";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifiedDetail = () => {
  const { id } = useParams();
  const { verifiedBadge, loading, refetch } = useGetVerifiedDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (!verifiedBadge) {
    return <p className="text-center mt-8 text-gray-500">No data found.</p>;
  }

  const { fullName, profilePicture, verificationStatus, identityCard } =
    verifiedBadge;

  return (
    <div className="space-y-6   ">
      {/* Profile Section */}
      <Card className="p-6 flex  gap-2 flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <img
          src={profilePicture}
          alt={fullName}
          className="w-28 h-28 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          <div className="flex gap-2">
            <Badge
              variant={
                verificationStatus === "PENDING"
                  ? "warning"
                  : verificationStatus === "VERIFIED"
                  ? "success"
                  : "danger"
              }
              className="mt-2"
            >
              {verificationStatus}
            </Badge>

            <Badge
              variant={
                identityCard.verified
                  ? "success"
                  : identityCard.verified
                  ? "danger"
                  : "danger"
              }
              className="mt-2"
            >
              {identityCard.verified ? "Verified" : "Not Verified"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Identity Card Section */}
      {identityCard ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Identity Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-medium mb-2">Front</p>
              <img
                src={identityCard.frontPic}
                alt="Front ID"
                className="w-full h-48 object-contain rounded"
              />
            </div>
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-medium mb-2">Back</p>
              <img
                src={identityCard.backPic}
                alt="Back ID"
                className="w-full h-48 object-contain rounded"
              />
            </div>
          </div>
        </Card>
      ) : (
        <p className="text-center text-gray-500">No identity card uploaded.</p>
      )}

      {/* Actions Section */}
    </div>
  );
};

export default VerifiedDetail;
