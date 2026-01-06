import React from "react";
import { useParams } from "react-router-dom";
import useReportDetail from "../hooks/reports/reportDetail";
import {
  RefreshCcw,
  Calendar,
  AlertCircle,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const ReportDetail = () => {
  const { id } = useParams();
  const { report, loading } = useReportDetail(id);

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCcw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-500">Loading report details...</span>
      </div>
    );
  }

  const { report: rpt, entity } = report;

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });


  // Determine status color
  const statusColor =
    rpt.status === "PENDING"
      ? "yellow"
      : rpt.status === "RESOLVED"
      ? "green"
      : "gray";
  
  
  return (
    <div className="min-h-screen bg-gray-50 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
        <Badge variant={statusColor}>{rpt.status}</Badge>
      </div>

      {/* Reporter Info */}
      <Card className="p-4 flex items-center justify-between gap-4">
        <div className="flex gap-3">

       
        {rpt.reportedByUser?.profilePicture && (
          <img
            src={rpt.reportedByUser.profilePicture}
            alt={rpt.reportedByUser.fullName}
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        )}
        <div>
          <p className="text-sm text-gray-500">Reported by</p>
          <p className="font-semibold text-gray-900">
            {rpt.reportedByUser.fullName}
          </p>
        </div>
        </div>
         {/* <div className="flex gap-3 mt-4">
         
            <Button variant="danger" onClick={handleBlockUser}>
              Block
            </Button>
            <Button variant="success" onClick={handleResolve}>
              Mark Resolved
            </Button>
          </div> */}
      </Card>

      {/* Report Info */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Report Info</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Subject</label>
            <p className="text-gray-900 mt-1">{rpt.subject}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Entity Type</label>
            <p className="text-gray-900 mt-1">{rpt.entityType}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Description</label>
            <p className="text-gray-700 mt-1">{rpt.description}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Reported On
            </label>
            <p className="text-gray-900 mt-1">{formatDateTime(rpt.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Entity Info */}
      {rpt.entityType === "USER" && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Reported User</h2>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {entity.email}
            </p>
            {/* <p>
              <strong>Deleted:</strong> {entity.isDeleted ? "Yes" : "No"}
            </p> */}
          </div>
         
        </Card>
      )}

      {rpt.entityType === "PRODUCT" && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Reported Product</h2>
          </div>
          <p>
            <strong>Name:</strong> {entity.name}
          </p>
          <p>
            <strong>Description:</strong> {entity.description}
          </p>
          <p>
            <strong>Quantity:</strong> {entity.quantity}
          </p>
          <p>
            <strong>Price Per Day:</strong> ${entity.pricePerDay}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {entity.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`product-${idx}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </Card>
      )}

      {rpt.entityType === "CHAT" && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {entity.messages?.map((msg, idx) => {
              const isSenderOne = msg.sender?.fullName === entity.participantOne.fullName;
              const avatar = isSenderOne
                ? entity.participantOne.profilePicture
                : entity.participantTwo.profilePicture;
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    isSenderOne ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <img
                    src={avatar}
                    alt={msg.sender.fullName}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      isSenderOne ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isSenderOne
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-gray-100 text-gray-900 rounded-tl-sm"
                      }`}
                    >
                      {msg.text && <p className="text-sm">{msg.text}</p>}
                      {msg.media?.map((m, i) => (
                        <img
                          key={i}
                          src={m}
                          alt={`media-${i}`}
                          className="mt-2 w-24 h-24 object-cover rounded-md"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Evidence */}
      {rpt.evidence?.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Evidence
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {rpt.evidence.map((file, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded-lg text-center">
                <FileText className="mx-auto w-8 h-8 text-gray-400" />
                <p className="truncate text-sm mt-1">{file}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(file, "_blank")}
                  className="mt-1"
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportDetail;
