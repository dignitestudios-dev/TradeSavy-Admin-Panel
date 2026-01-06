import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  MessageSquare,
  Bell,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CHART_COLORS, API_CONFIG } from "../config/constants";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatsCard from "../components/common/StatsCard";
import useGetDashboardAnalytics from "../hooks/dashboard-analytics/useGetDashboardAnalytics";
import UserManagement from "./UserManagement";

const Dashboard = () => {
  const { addNotification } = useApp();
  const [stats, setStats] = useState({
    totalUsers: 12345,
    activeUsers: 8432,
    blockedUsers: 234,
    totalRevenue: 1234567,
    monthlyRevenue: 89432,
    totalTransactions: 5678,
    pendingTickets: 23,
    activeSessions: 1432,
  });
  const { dashboardAnalytics } = useGetDashboardAnalytics();
  console.log(dashboardAnalytics, "dashboardAnalytics");
  // Revenue chart data (monthly)
  const [revenueData] = useState([
    { month: "Jan", revenue: 45000, users: 1200, transactions: 450 },
    { month: "Feb", revenue: 52000, users: 1350, transactions: 520 },
    { month: "Mar", revenue: 48000, users: 1280, transactions: 480 },
    { month: "Apr", revenue: 61000, users: 1520, transactions: 610 },
    { month: "May", revenue: 55000, users: 1420, transactions: 550 },
    { month: "Jun", revenue: 67000, users: 1680, transactions: 670 },
    { month: "Jul", revenue: 72000, users: 1800, transactions: 720 },
    { month: "Aug", revenue: 69000, users: 1750, transactions: 690 },
    { month: "Sep", revenue: 78000, users: 1950, transactions: 780 },
    { month: "Oct", revenue: 84000, users: 2100, transactions: 840 },
    { month: "Nov", revenue: 89000, users: 2250, transactions: 890 },
    { month: "Dec", revenue: 95000, users: 2400, transactions: 950 },
  ]);

  // User analytics data
  const [userAnalytics] = useState([
    { name: "Active", value: 8432, color: CHART_COLORS.success },
    { name: "Inactive", value: 3877, color: CHART_COLORS.warning },
    { name: "Blocked", value: 234, color: CHART_COLORS.error },
  ]);

  // Recent activities
  const [recentActivities] = useState([
    {
      id: 1,
      type: "user_registered",
      user: "John Doe",
      time: "2 minutes ago",
      icon: UserCheck,
    },
    {
      id: 2,
      type: "transaction_completed",
      user: "Jane Smith",
      amount: 299,
      time: "5 minutes ago",
      icon: CreditCard,
    },
    {
      id: 3,
      type: "support_ticket",
      user: "Bob Johnson",
      time: "10 minutes ago",
      icon: MessageSquare,
    },
    {
      id: 4,
      type: "user_blocked",
      user: "Alice Brown",
      time: "15 minutes ago",
      icon: UserX,
    },
    {
      id: 5,
      type: "notification_sent",
      count: 1250,
      time: "30 minutes ago",
      icon: Bell,
    },
  ]);

  // Transaction status data
  const [transactionData] = useState([
    { status: "Completed", count: 4521, amount: 892340 },
    { status: "Pending", count: 234, amount: 45670 },
    { status: "Failed", count: 123, amount: 12340 },
    { status: "Refunded", count: 89, amount: 8900 },
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      user_registered: UserCheck,
      transaction_completed: CreditCard,
      support_ticket: MessageSquare,
      user_blocked: UserX,
      notification_sent: Bell,
    };
    return iconMap[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      user_registered: "text-green-600",
      transaction_completed: "text-blue-600",
      support_ticket: "text-yellow-600",
      user_blocked: "text-red-600",
      notification_sent: "text-purple-600",
    };
    return colorMap[type] || "text-gray-600";
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "default";
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity
      const activities = [
        "New user registered",
        "Transaction completed",
        "Support ticket created",
        "User blocked",
        "Notification sent",
      ];

      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];

      addNotification({
        title: "System Update",
        message: randomActivity,
        type: "info",
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const mainStats = [
    {
      title: "Total Users",
      value: formatNumber(dashboardAnalytics?.totalUsers || 0),
      icon: Users,
    },
    {
      title: "Total Verified Users",
      value: formatNumber(dashboardAnalytics?.totalVerifiedUsers || 0),
      icon: Activity,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardAnalytics?.totalRevenue || 0),

      icon: DollarSign,
    },
    {
      title: "Total Order", 
      value: dashboardAnalytics?.totalOrders || 0,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric", 
            })}
          </span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.trend === "up" ? "positive" : "negative"}
            icon={stat.icon ? <stat.icon /> : null}
            index={index}
          />
        ))}
      </div>
<UserManagement />
      {/* Secondary Stats */}

      {/* Charts Section */}
    </div>
  );
};

export default Dashboard;
