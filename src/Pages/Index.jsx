import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import Modal from "../Components/Modal";

export default function Index() {
  const [tickets, setTickets] = useState([]);
  const [types, setTypes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    title: "",
    description: "",
    ticket_type_id: "",
    project_id: "",
    assign_at: "",
    status: "open",
  });
  const [modalMode, setModalMode] = useState(null);
  const [error, setError] = useState({});
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
    fetchMeta();
  }, []);

  function fetchTickets() {
    axios
      .get(`${API_URL}/tickets`)
      .then((res) => setTickets(res.data))
      .catch((err) => console.error("Gagal ambil tiket", err));
  }

  function fetchMeta() {
    axios
      .get(`${API_URL}/ticket-types`)
      .then((res) => setTypes(res.data))
      .catch((err) => console.error("Gagal ambil jenis tiket", err));

    axios
      .get(`${API_URL}/projects`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Gagal ambil project", err));
  }

  function openModal(mode, ticket = null) {
    setError({});
    setModalMode(mode);
    if (mode === "edit" && ticket) {
      setForm({ ...ticket });
    } else if (mode === "detail" && ticket) {
      setSelectedTicket(ticket);
    } else {
      setForm({
        id: "",
        name: "",
        email: "",
        title: "",
        description: "",
        ticket_type_id: "",
        project_id: "",
        assign_at: "",
        status: "open",
      });
    }
  }

  function closeModal() {
    setModalMode(null);
    setForm({});
    setSelectedTicket(null);
    setError({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method =
      modalMode === "edit"
        ? axios.put(`${API_URL}/tickets/${form.id}`, form)
        : axios.post(`${API_URL}/tickets`, form);

    method
      .then(() => {
        fetchTickets();
        closeModal();
        setAlert(
          modalMode === "edit"
            ? "Tiket berhasil diperbarui"
            : "Tiket berhasil ditambahkan"
        );
      })
      .catch((err) => {
        setError(err.response?.data?.errors || { global: "Terjadi kesalahan" });
      });
  }

  function handleDelete() {
    if (selectedTicket.status !== "cancel") {
      setAlert("Hanya tiket dengan status cancel yang bisa dihapus");
      closeModal();
      return;
    }

    axios
      .delete(`${API_URL}/tickets/${selectedTicket.id}`)
      .then(() => {
        fetchTickets();
        closeModal();
        setAlert("Tiket berhasil dihapus");
      })
      .catch((err) => {
        setAlert(err.response?.data?.error || "Gagal menghapus tiket");
      });
  }

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.name?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {alert && (
        <div
          className="alert alert-info alert-dismissible fade show d-flex align-items-center"
          style={{ borderRadius: "8px" }}
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          <span>{alert}</span>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="position-relative" style={{ width: "50%" }}>
          <i
            className="bi bi-search position-absolute"
            style={{ top: "10px", left: "10px", color: "#6c757d" }}
          ></i>
          <input
            className="form-control ps-4"
            placeholder="Cari nama atau judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: "8px", border: "1px solid #dee2e6" }}
          />
        </div>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => openModal("add")}
          style={{ borderRadius: "8px" }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Tiket
        </button>
      </div>

      <div className="table-responsive">
        <table
          className="table table-hover"
          style={{ borderRadius: "8px", overflow: "hidden" }}
        >
          <thead className="table-light">
            <tr>
              <th style={{ padding: "12px 16px" }}>Nama</th>
              <th style={{ padding: "12px 16px" }}>Email</th>
              <th style={{ padding: "12px 16px" }}>Judul</th>
              <th style={{ padding: "12px 16px" }}>Deskripsi</th>
              <th style={{ padding: "12px 16px" }}>Type</th>
              <th style={{ padding: "12px 16px" }}>Project</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px" }}>Assign</th>
              <th style={{ padding: "12px 16px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} style={{ verticalAlign: "middle" }}>
                  <td style={{ padding: "12px 16px" }}>{ticket.name}</td>
                  <td style={{ padding: "12px 16px" }}>{ticket.email}</td>
                  <td style={{ padding: "12px 16px" }}>{ticket.title}</td>
                  <td
                    style={{
                      padding: "12px 16px",
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ticket.description}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {ticket.ticket_type?.name}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {ticket.project?.name}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      className={`badge ${
                        ticket.status === "open"
                          ? "bg-primary"
                          : ticket.status === "progress"
                          ? "bg-warning text-dark"
                          : ticket.status === "closed"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                      style={{
                        borderRadius: "12px",
                        padding: "6px 12px",
                        fontWeight: "500",
                      }}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>{ticket.assign_at}</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openModal("detail", ticket)}
                      style={{ borderRadius: "6px", padding: "6px 10px" }}
                    >
                      <i className="bi bi-eye-fill"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => openModal("edit", ticket)}
                      style={{ borderRadius: "6px", padding: "6px 10px" }}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    {ticket.status === "cancel" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setModalMode("delete");
                        }}
                        style={{ borderRadius: "6px", padding: "6px 10px" }}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted">
                  <i
                    className="bi bi-inbox"
                    style={{ fontSize: "24px", marginBottom: "8px" }}
                  ></i>
                  <div>Tidak ada data</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add */}
      {modalMode === "add" && (
        <Modal
          title="Tambah Tiket"
          onClose={closeModal}
          footer={
            <>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={closeModal}
                style={{ borderRadius: "6px" }}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-plus-circle me-1"></i> Tambah
              </button>
            </>
          }
          style={{ maxWidth: "600px" }}
        >
          <form className="p-3">
            {[
              { label: "Nama", type: "text", key: "name", icon: "bi-person" },
              {
                label: "Email",
                type: "email",
                key: "email",
                icon: "bi-envelope",
              },
              {
                label: "Judul",
                type: "text",
                key: "title",
                icon: "bi-card-text",
              },
              {
                label: "Tanggal Masalah",
                type: "date",
                key: "assign_at",
                icon: "bi-calendar",
              },
            ].map((field) => (
              <div className="mb-3" key={field.key}>
                <label className="form-label fw-medium">
                  <i className={`bi ${field.icon} me-2`}></i>
                  {field.label}
                </label>
                <div className="input-group">
                  <input
                    type={field.type}
                    className="form-control border-end-0"
                    value={form[field.key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    required
                    style={{ borderRadius: "6px" }}
                  />
                </div>
                {error[field.key] && (
                  <div className="text-danger small mt-1">
                    {error[field.key][0]}
                  </div>
                )}
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-text-paragraph me-2"></i>
                Deskripsi
              </label>
              <textarea
                className="form-control"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={{ borderRadius: "6px", minHeight: "100px" }}
              />
              {error.description && (
                <div className="text-danger small mt-1">
                  {error.description[0]}
                </div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    <i className="bi bi-tag me-2"></i>
                    Jenis Tiket
                  </label>
                  <select
                    className="form-select"
                    value={form.ticket_type_id || ""}
                    onChange={(e) =>
                      setForm({ ...form, ticket_type_id: e.target.value })
                    }
                    required
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">-- Pilih Jenis Tiket --</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {error.ticket_type_id && (
                    <div className="text-danger small mt-1">
                      {error.ticket_type_id[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    <i className="bi bi-folder me-2"></i>
                    Project
                  </label>
                  <select
                    className="form-select"
                    value={form.project_id || ""}
                    onChange={(e) =>
                      setForm({ ...form, project_id: e.target.value })
                    }
                    required
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">-- Pilih Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {error.project_id && (
                    <div className="text-danger small mt-1">
                      {error.project_id[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-list-check me-2"></i>
                Status
              </label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                required
                style={{ borderRadius: "6px" }}
              >
                {["open", "progress", "closed", "cancel"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {error.status && (
                <div className="text-danger small mt-1">{error.status[0]}</div>
              )}
            </div>
          </form>
        </Modal>
      )}

      {/* modal Edit */}
      {modalMode === "edit" && (
        <Modal
          title="Edit Tiket"
          onClose={closeModal}
          footer={
            <>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={closeModal}
                style={{ borderRadius: "6px" }}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-check-circle me-1"></i> Simpan
              </button>
            </>
          }
          style={{ maxWidth: "600px" }}
        >
          <form className="p-3">
            <div className="mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                className="form-control"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ borderRadius: "6px" }}
              />
              {error.email && (
                <div className="text-danger small mt-1">{error.email[0]}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-text-paragraph me-2"></i>Deskripsi
              </label>
              <textarea
                className="form-control"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={{ borderRadius: "6px", minHeight: "100px" }}
              />
              {error.description && (
                <div className="text-danger small mt-1">
                  {error.description[0]}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-tag me-2"></i>Jenis Tiket
              </label>
              <select
                className="form-select"
                value={form.ticket_type_id || ""}
                onChange={(e) =>
                  setForm({ ...form, ticket_type_id: e.target.value })
                }
                required
                style={{ borderRadius: "6px" }}
              >
                <option value="">-- Pilih Jenis Tiket --</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {error.ticket_type_id && (
                <div className="text-danger small mt-1">
                  {error.ticket_type_id[0]}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-list-check me-2"></i>Status
              </label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                required
                style={{ borderRadius: "6px" }}
              >
                {["open", "progress", "closed", "cancel"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {error.status && (
                <div className="text-danger small mt-1">{error.status[0]}</div>
              )}
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Detail */}
      {modalMode === "detail" && selectedTicket && (
        <Modal
          title="Detail Tiket"
          onClose={closeModal}
          footer={
            <button
              className="btn btn-outline-secondary"
              onClick={closeModal}
              style={{ borderRadius: "6px" }}
            >
              <i className="bi bi-x-circle me-1"></i> Tutup
            </button>
          }
          style={{ maxWidth: "500px" }}
        >
          <div className="p-3">
            {[
              { label: "Nama", value: selectedTicket.name, icon: "bi-person" },
              {
                label: "Email",
                value: selectedTicket.email,
                icon: "bi-envelope",
              },
              {
                label: "Judul",
                value: selectedTicket.title,
                icon: "bi-card-text",
              },
              {
                label: "Deskripsi",
                value: selectedTicket.description,
                icon: "bi-text-paragraph",
              },
              {
                label: "Jenis Tiket",
                value: selectedTicket.ticket_type?.name,
                icon: "bi-tag",
              },
              {
                label: "Project",
                value: selectedTicket.project?.name,
                icon: "bi-folder",
              },
              {
                label: "Status",
                value: selectedTicket.status,
                icon: "bi-list-check",
              },
              {
                label: "Assign At",
                value: selectedTicket.assign_at,
                icon: "bi-calendar",
              },
            ].map((item, index) => (
              <div key={index} className="mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center">
                  <i
                    className={`bi ${item.icon} me-2 text-muted`}
                    style={{ width: "24px" }}
                  ></i>
                  <div>
                    <div className="text-muted small">{item.label}</div>
                    <div className="fw-medium">{item.value || "-"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal Delete */}
      {modalMode === "delete" && selectedTicket && (
        <Modal
          title="Konfirmasi Hapus"
          onClose={closeModal}
          footer={
            <>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={closeModal}
                style={{ borderRadius: "6px" }}
              >
                Batal
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-trash me-1"></i> Hapus
              </button>
            </>
          }
          style={{ maxWidth: "500px" }}
        >
          <div className="p-4 text-center">
            <i
              className="bi bi-exclamation-triangle text-warning"
              style={{ fontSize: "48px" }}
            ></i>
            <h5 className="mt-3">Yakin ingin menghapus tiket?</h5>
            <p className="fw-medium">{selectedTicket.title}</p>
            {selectedTicket.status !== "cancel" && (
              <div
                className="alert alert-warning mt-3"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-info-circle me-2"></i>
                Hanya tiket dengan status <strong>cancel</strong> yang bisa
                dihapus.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
