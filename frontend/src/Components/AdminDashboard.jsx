import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loader from "./layout/Loader";
import { getRestaurants } from "../redux/actions/restaurantAction";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Description Generator state
  const [foodName, setFoodName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [generatedDesc, setGeneratedDesc] = useState(null);
  const [loadingDesc, setLoadingDesc] = useState(false);

  // Review Analyzer state
  const { restaurants } = useSelector((state) => state.restaurants || { restaurants: [] });
  const [selectedResId, setSelectedResId] = useState("");
  const [analyzedReviews, setAnalyzedReviews] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch all restaurants on mount so the dropdown is populated
  useEffect(() => {
    dispatch(getRestaurants());
  }, [dispatch]);

  const handleGenerateDescription = async (e) => {
    e.preventDefault();
    if (!foodName) {
      toast.error("Please enter a food item name.");
      return;
    }
    setLoadingDesc(true);
    try {
      const { data } = await api.post("/v1/ai/generate-description", {
        name: foodName,
        cuisine,
        ingredients
      });
      setGeneratedDesc(data.data);
      toast.success("AI Description generated!");
    } catch (err) {
      toast.error("Generation failed.");
    } finally {
      setLoadingDesc(false);
    }
  };

  const handleAnalyzeReviews = async () => {
    if (!selectedResId) {
      toast.error("Please select a restaurant.");
      return;
    }
    const targetRes = restaurants.find(r => r._id === selectedResId);
    if (!targetRes || !targetRes.reviews || targetRes.reviews.length === 0) {
      toast.error("This restaurant does not have any reviews to analyze.");
      return;
    }

    setLoadingReviews(true);
    try {
      const { data } = await api.post("/v1/ai/analyze-reviews", {
        reviews: targetRes.reviews
      });
      setAnalyzedReviews(data.data);
      toast.success("Reviews analysis completed!");
    } catch (err) {
      toast.error("Analysis failed.");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="container-fluid py-5" style={{
      background: "linear-gradient(135deg, #020617 0%, #0F172A 45%, #111827 100%)",
      minHeight: "90vh",
      fontFamily: "'Outfit', sans-serif",
      color: "#F8FAFC",
      marginTop: "-24px",
      paddingLeft: "24px",
      paddingRight: "24px"
    }}>
      <div className="container">
        <h1 className="mb-2 text-center" style={{
          fontWeight: "900",
          fontSize: "2.6rem",
          letterSpacing: "-0.5px",
          background: "linear-gradient(135deg, #F97316 0%, #FDBA74 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Food Genie AI Hub
        </h1>
        <p className="text-center mb-5" style={{ fontSize: "0.95rem", color: "#94A3B8" }}>
          Supercharge your copy and analyze sentiment instantly with predictive models.
        </p>

        <div className="row g-4">
          {/* Left Card: AI Description Generator */}
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div className="card p-4 h-100" style={{
              background: "#1E293B",
              borderRadius: "24px",
              boxShadow: "0 15px 35px rgba(249,115,22,.12)",
              border: "1px solid #334155",
              color: "#F8FAFC"
            }}>
              <h3 className="mb-4 d-flex align-items-center" style={{ fontWeight: "800", color: "#FB923C", fontSize: "1.35rem", gap: "10px" }}>
                <span>🪄</span> AI Description Generator
              </h3>

              <form onSubmit={handleGenerateDescription}>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#CBD5E1" }}>Food Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Garlic Butter Prawns"
                    style={{
                      borderRadius: "10px",
                      background: "#0F172A",
                      border: "1px solid #334155",
                      color: "#F8FAFC",
                      padding: "10px 14px"
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#CBD5E1" }}>Cuisine Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="e.g. Chinese, Indian, Italian"
                    style={{
                      borderRadius: "10px",
                      background: "#0F172A",
                      border: "1px solid #334155",
                      color: "#F8FAFC",
                      padding: "10px 14px"
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#CBD5E1" }}>Ingredients</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. prawns, butter, garlic, parsley, lemon"
                    style={{
                      borderRadius: "10px",
                      background: "#0F172A",
                      border: "1px solid #334155",
                      color: "#F8FAFC",
                      padding: "10px 14px"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-3"
                  style={{
                    background: "linear-gradient(135deg, #F97316, #EA580C)",
                    fontWeight: "700",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(249,115,22,.35)",
                    transition: "all .3s ease"
                  }}
                  disabled={loadingDesc}
                >
                  {loadingDesc ? "Generating Copy..." : "Generate AI Copy"}
                </button>
              </form>

              {generatedDesc && (
                <div className="mt-4 p-4" style={{
                  borderRadius: "16px",
                  border: "1px solid #334155",
                  background: "#0F172A"
                }}>
                  <h5 style={{ fontWeight: "600", fontSize: "0.85rem", color: "#CBD5E1" }}>Short Copy</h5>
                  <p style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>{generatedDesc.shortDescription}</p>

                  <h5 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#FB923C", marginTop: "16px" }}>Long Copy</h5>
                  <p style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>{generatedDesc.longDescription}</p>

                  <h5 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#FB923C", marginTop: "16px" }}>Taste Profile</h5>
                  <p style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>{generatedDesc.tasteProfile}</p>

                  <h5 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#FB923C", marginTop: "16px" }}>SEO Keywords</h5>
                  <code style={{ fontSize: "0.78rem", color: "#FBBF24" }}>{generatedDesc.seoText}</code>

                  <button
                    onClick={() => handleCopy(generatedDesc.longDescription)}
                    className="btn btn-sm mt-3 w-100 py-2"
                    style={{
                      background: "#1E293B",
                      border: "1px solid #F97316",
                      color: "#F97316",
                      borderRadius: "10px",
                      fontWeight: "600",
                      fontSize: "0.8rem"
                    }}
                  >
                    Copy Long Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Card: AI Review Analyzer */}
          <div className="col-12 col-lg-6">
            <div className="card p-4 h-100" style={{
              background: "#1E293B",
              borderRadius: "24px",
              boxShadow: "0 15px 35px rgba(249,115,22,.12)",
              border: "1px solid #334155",
              color: "#F8FAFC"
            }}>
              <h3 className="mb-4 d-flex align-items-center" style={{ fontWeight: "800", color: "#FB923C", fontSize: "1.35rem", gap: "10px" }}>
                <span>📊</span> AI Review Sentiment Analyzer
              </h3>

              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: "600", fontSize: "0.85rem", color: "#CBD5E1" }}>Select Restaurant to Analyze &nbsp; &nbsp; </label>
                <select
                  className="form-select"
                  value={selectedResId}
                  onChange={(e) => setSelectedResId(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    padding: "10px 14px",
                    background: "#0F172A",
                    border: "1px solid #334155",
                    color: "#F8FAFC"
                  }}
                >
                  <option value="" style={{ background: "#0F172A" }}>-- Choose Restaurant --</option>
                  {restaurants.map(r => (
                    <option key={r._id} value={r._id} style={{ background: "#0F172A" }}>{r.name} ({r.numOfReviews} reviews)</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAnalyzeReviews}
                className="btn w-100 py-3"
                style={{
                  background: "linear-gradient(135deg, #F97316, #EA580C)",
                  fontWeight: "700",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(249,115,22,.35)",
                  transition: "all .3s ease"
                }}
                disabled={loadingReviews}
              >
                {loadingReviews ? "Analyzing Reviews..." : "Analyze Reviews"}
              </button>

              {analyzedReviews && (
                <div className="mt-4 p-4" style={{
                  borderRadius: "16px",
                  border: "1px solid #334155",
                  background: "#0F172A",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                }}>
                  {/* Score & Sentiment Header Card */}
                  <div className="d-flex align-items-center justify-content-between p-3 mb-4" style={{
                    background: "linear-gradient(135deg, #1E293B 0%, #172554 100%)",
                    borderRadius: "12px",
                    border: "1px solid #334155"
                  }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>Overall Sentiment</span>
                      <h4 className="m-0" style={{ fontWeight: "800", color: "#FB923C", fontSize: "1.15rem" }}>{analyzedReviews.overallSentiment}</h4>
                    </div>
                    <div className="text-right d-flex align-items-center" style={{ gap: "8px" }}>
                      <span style={{ fontSize: "1.8rem", fontWeight: "900", color: "#FB923C" }}>
                        {analyzedReviews.customerSatisfactionScore || "4.5"}
                      </span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#94A3B8" }}>/ 5.0</span>
                    </div>
                  </div>

                  {/* Sentiment Breakdown Progress Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#CBD5E1" }}>Sentiment Distribution</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94A3B8" }}>Real feedback</span>
                    </div>
                    <div className="progress" style={{ height: "20px", borderRadius: "10px", overflow: "hidden", background: "#0F172A" }}>
                      <div className="progress-bar" style={{ width: `${analyzedReviews.positivePercent}%`, backgroundColor: "#22C55E", fontWeight: "700", fontSize: "0.75rem" }}>{analyzedReviews.positivePercent}% Pos</div>
                      <div className="progress-bar text-dark" style={{ width: `${analyzedReviews.neutralPercent}%`, backgroundColor: "#F59E0B", fontWeight: "700", fontSize: "0.75rem" }}>{analyzedReviews.neutralPercent}% Neu</div>
                      <div className="progress-bar" style={{ width: `${analyzedReviews.negativePercent}%`, backgroundColor: "#EF4444", fontWeight: "700", fontSize: "0.75rem" }}>{analyzedReviews.negativePercent}% Neg</div>
                    </div>
                  </div>

                  {/* Praises and Complaints - Side-by-Side Flex Columns */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                      <div className="p-3 h-100" style={{ background: "#052E16", borderRadius: "12px", border: "1px solid #16A34A" }}>
                        <h5 style={{ fontWeight: "800", fontSize: "0.85rem", color: "#BBF7D0", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#22C55E", fontSize: "1.1rem" }}>✓</span> Highlights
                        </h5>
                        <ul className="list-unstyled ps-0 m-0" style={{ fontSize: "0.78rem", color: "#BBF7D0", lineHeight: "1.6" }}>
                          {analyzedReviews.commonPraises.map((p, idx) => (
                            <li key={idx} className="mb-2 d-flex align-items-start" style={{ gap: "6px" }}>
                              <span style={{ color: "#22C55E", fontWeight: "bold" }}>•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="p-3 h-100" style={{ background: "#450A0A", borderRadius: "12px", border: "1px solid #DC2626" }}>
                        <h5 style={{ fontWeight: "800", fontSize: "0.85rem", color: "#FECACA", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#EF4444", fontSize: "1.1rem" }}>⚠</span> Concerns
                        </h5>
                        <ul className="list-unstyled ps-0 m-0" style={{ fontSize: "0.78rem", color: "#FECACA", lineHeight: "1.6" }}>
                          {analyzedReviews.commonComplaints.map((c, idx) => (
                            <li key={idx} className="mb-2 d-flex align-items-start" style={{ gap: "6px" }}>
                              <span style={{ color: "#EF4444", fontWeight: "bold" }}>•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* AI Improvement Suggestions */}
                  <div className="p-3" style={{
                    background: "#422006",
                    borderRadius: "12px",
                    borderLeft: "4px solid #F59E0B",
                    border: "1px solid #92400E"
                  }}>
                    <h5 style={{ fontWeight: "800", fontSize: "0.85rem", color: "#FDE68A", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      💡 Suggestions
                    </h5>
                    <ul className="list-unstyled ps-0 m-0" style={{ fontSize: "0.78rem", color: "#FDE68A", lineHeight: "1.6" }}>
                      {analyzedReviews.suggestions.map((s, idx) => (
                        <li key={idx} className="mb-2 d-flex align-items-start" style={{ gap: "6px" }}>
                          <span style={{ color: "#FBBF24", fontWeight: "bold" }}>👉</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
