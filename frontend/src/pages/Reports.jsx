import { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedReport, setSelectedReport] = useState(null);

    // =========================
    // FETCH REPORTS
    // =========================

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("access");

            if (!token) {
                setError("You are not logged in.");
                return;
            }

            const response = await axios.get(
                "http://127.0.0.1:8000/api/reports/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("REPORTS RESPONSE:", response.data);

            // Backend may return:
            // 1. Direct array
            // 2. Paginated object with results

            const reportData = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setReports(reportData);

        } catch (error) {
            console.error(
                "REPORTS ERROR:",
                error.response?.data || error.message
            );

            console.error(
                "REPORTS STATUS:",
                error.response?.status
            );

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You do not have permission to view reports.");
            } else if (error.response?.status === 404) {
                setError("Reports API was not found.");
            } else if (error.response?.status === 500) {
                setError("Server error while loading reports.");
            } else {
                setError("Unable to load reports.");
            }

            setReports([]);

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOAD REPORTS
    // =========================

    useEffect(() => {
        fetchReports();
    }, []);

    // =========================
    // VIEW REPORT
    // =========================

    const viewReport = (report) => {
        setSelectedReport(report);
    };

    // =========================
    // CLOSE DETAILS
    // =========================

    const closeDetails = () => {
        setSelectedReport(null);
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="reports-page">
                <h2>Loading reports...</h2>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="reports-page">
                <div className="reports-header">
                    <h1>Reports Management</h1>

                    <p>
                        View employee and manager daily reports
                    </p>
                </div>

                <div className="report-error">
                    <h2>{error}</h2>

                    <button onClick={fetchReports}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="reports-header">

                <h1>
                    Reports Management
                </h1>

                <p>
                    View employee and manager daily reports
                </p>

            </div>


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="reports-summary">

                {/* TOTAL REPORTS */}

                <div className="report-summary-card">

                    <p>
                        Total Reports
                    </p>

                    <h2>
                        {reports.length}
                    </h2>

                </div>


                {/* PENDING */}

                <div className="report-summary-card">

                    <p>
                        Pending
                    </p>

                    <h2>
                        {
                            reports.filter(
                                (report) =>
                                    report.status === "PENDING"
                            ).length
                        }
                    </h2>

                </div>


                {/* SUBMITTED */}

                <div className="report-summary-card">

                    <p>
                        Submitted
                    </p>

                    <h2>
                        {
                            reports.filter(
                                (report) =>
                                    report.status === "SUBMITTED"
                            ).length
                        }
                    </h2>

                </div>


                {/* REVIEWED */}

                <div className="report-summary-card">

                    <p>
                        Reviewed
                    </p>

                    <h2>
                        {
                            reports.filter(
                                (report) =>
                                    report.status === "REVIEWED"
                            ).length
                        }
                    </h2>

                </div>

            </div>


            {/* =========================
                REPORT TABLE
            ========================= */}

            <div className="reports-table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Employee
                            </th>

                            <th>
                                Report Date
                            </th>

                            <th>
                                Total Sales
                            </th>

                            <th>
                                Products Sold
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {reports.length === 0 ? (

                            <tr>

                                <td colSpan="7">
                                    No reports found.
                                </td>

                            </tr>

                        ) : (

                            reports.map(
                                (report) => (

                                    <tr
                                        key={report.id}
                                    >

                                        {/* ID */}

                                        <td>
                                            {report.id}
                                        </td>


                                        {/* EMPLOYEE */}

                                        <td>
                                            {
                                                report.employee_name ||
                                                report.employee ||
                                                "Unknown"
                                            }
                                        </td>


                                        {/* REPORT DATE */}

                                        <td>
                                            {
                                                report.report_date
                                            }
                                        </td>


                                        {/* TOTAL SALES */}

                                        <td>

                                            ₹
                                            {Number(
                                                report.total_sales || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </td>


                                        {/* PRODUCTS SOLD */}

                                        <td>
                                            {
                                                report.products_sold || 0
                                            }
                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`report-status ${String(
                                                    report.status || ""
                                                ).toLowerCase()}`}
                                            >
                                                {
                                                    report.status ||
                                                    "UNKNOWN"
                                                }
                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <button
                                                onClick={() =>
                                                    viewReport(report)
                                                }
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>


            {/* =========================
                REPORT DETAILS
            ========================= */}

            {selectedReport && (

                <div className="report-details">

                    <div className="report-details-header">

                        <h2>
                            Report Details
                        </h2>

                        <button
                            onClick={closeDetails}
                        >
                            ✕
                        </button>

                    </div>


                    <div className="report-details-content">

                        {/* REPORT ID */}

                        <p>

                            <strong>
                                Report ID:
                            </strong>

                            {" "}

                            {
                                selectedReport.id
                            }

                        </p>


                        {/* EMPLOYEE */}

                        <p>

                            <strong>
                                Employee:
                            </strong>

                            {" "}

                            {
                                selectedReport.employee_name ||
                                selectedReport.employee ||
                                "Unknown"
                            }

                        </p>


                        {/* REPORT DATE */}

                        <p>

                            <strong>
                                Report Date:
                            </strong>

                            {" "}

                            {
                                selectedReport.report_date
                            }

                        </p>


                        {/* TOTAL SALES */}

                        <p>

                            <strong>
                                Total Sales:
                            </strong>

                            {" "}

                            ₹
                            {Number(
                                selectedReport.total_sales || 0
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </p>


                        {/* PRODUCTS SOLD */}

                        <p>

                            <strong>
                                Products Sold:
                            </strong>

                            {" "}

                            {
                                selectedReport.products_sold || 0
                            }

                        </p>


                        {/* STATUS */}

                        <p>

                            <strong>
                                Status:
                            </strong>

                            {" "}

                            {
                                selectedReport.status ||
                                "UNKNOWN"
                            }

                        </p>


                        {/* DESCRIPTION */}

                        <div>

                            <strong>
                                Description:
                            </strong>

                            <p>

                                {
                                    selectedReport.description ||
                                    "No description provided."
                                }

                            </p>

                        </div>


                        {/* CREATED AT */}

                        <p>

                            <strong>
                                Created At:
                            </strong>

                            {" "}

                            {
                                selectedReport.created_at ||
                                "Not available"
                            }

                        </p>


                        {/* UPDATED AT */}

                        <p>

                            <strong>
                                Updated At:
                            </strong>

                            {" "}

                            {
                                selectedReport.updated_at ||
                                "Not available"
                            }

                        </p>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Reports;