import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";



export default function DocumentDetails() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
const location = useLocation();
const searchQuery = location.state?.query;
const previousResults = location.state?.results;
const previousLocation = location.state?.location;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/document/${id}`);
        if (!res.ok) throw new Error("Document not found");

        const data = await res.json();
        setDoc(data);
        setImageUrl(`/image/${data.image_id}`);

        // If comments are part of the document
        setComments(data.comments || []);
      } catch (err) {
        setError("Error fetching document");
      }
    }

    fetchData();
  }, [id]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.classList.toggle("modal-open", showModal);
    return () => document.body.classList.remove("modal-open");
  }, [showModal]);

  const handleAddComment = async () => {
  const trimmed = newComment.trim();
  if (!trimmed) return;

  try {
    const res = await fetch(`/document/${id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed),
    });

    if (!res.ok) throw new Error("Failed to add comment");

    // Re-fetch the document to get the updated comments
    const updatedRes = await fetch(`/document/${id}`);
    const updatedDoc = await updatedRes.json();
    setComments(updatedDoc.comments || []);

    setNewComment("");
  } catch (err) {
    console.error("Comment error:", err);
  }
};



  if (error) return <p className="text-danger">{error}</p>;
  if (!doc) return <p>Loading document...</p>;

  return (
    <div className="text-start">
      <div className="card shadow-sm p-4">
<Link
  to="/"
  state={{
    query: searchQuery,
    results: previousResults,
    location: previousLocation,
    filters: location.state?.filters || {}
  }}
  className="btn btn-light mb-3"
>
  &larr; Back to Search Results
</Link>




        <h2 className="h4 fw-bold">{doc.common_name || "Unnamed Species"}</h2>
        <p className="text-muted mb-4">{doc.scientific_name}</p>

        {/* Clickable image */}
        <div className="d-flex justify-content-center">
          <img
            src={imageUrl}
            alt={doc.common_name || "Species"}
            className="img-fluid rounded mb-4 border"
            style={{
              maxHeight: "500px",
              objectFit: "contain",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
            }}
            onClick={() => setShowModal(true)}
          />
        </div>

        <div>
          <p><strong>Description:</strong> {doc.description}</p>
          <p><strong>Observed At:</strong> {doc.time_observed_at}</p>
          <p><strong>User:</strong> {doc.user_login}</p>
          <p><strong>Location Guess:</strong> {doc.place_guess}</p>
          <p>
            <strong>Coordinates:</strong> [{doc.location.coordinates[0]}, {doc.location.coordinates[1]}]
          </p>
          <p><strong>Taxon Geoprivacy:</strong> {doc.taxon_geoprivacy}</p>
          <p><strong>Taxon ID:</strong> {doc.taxon_id}</p>
        </div>

        {/* Comments Section */}
        <hr className="my-4" />
        <h5 className="fw-bold">Comments</h5>

        <ul className="list-group mb-3">
            {comments.map((c, i) => (
  <li key={i} className="list-group-item">
    • {typeof c === "string" ? c : c.comment || JSON.stringify(c)}
  </li>
))}

        </ul>

        <div className="d-flex gap-2">
<textarea
  className="form-control"
  placeholder="Add a new comment..."
  value={newComment}
  onChange={(e) => setNewComment(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  }}
  rows={1}
/>

          <button className="btn btn-success" onClick={handleAddComment}>
            Add Comment
          </button>
        </div>
      </div>

      {/* Modal for full-size image */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content bg-dark border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-body p-0 text-center">
                <img
                  src={imageUrl}
                  alt="Full size"
                  className="img-fluid"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




