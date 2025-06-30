import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfo,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Components/Modal";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState({});
  const [detailTicket, setDetailTicket] = useState({});
  const [formModal, setFormModal] = useState({
    email: "",
    title: "",
    description: "",
    ticket_type_id: "",
    status: "",
    assign_at: "",
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios
      .get(API_URL)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTickets(data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        }
        setError(
          err.response
            ? err.response.data
            : { message: "An unexpected error occurred" }
        );
      });
  }

  function handleSubmitModal(e) {
    e.preventDefault();
    axios
      .post(API_URL, formModal)
      .then(() => {
        setIsModalOpen(false);
        setFormModal({
          email: "",
          title: "",
          description: "",
          ticket_type_id: "",
          status: "",
          assign_at: "",
        });
        setError([]);
        fetchData();
      })
      .catch((err) => {
        setError(err.response?.data || { message: "Terjadi kesalahan." });
      });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    axios
      .patch(`${API_URL}/${selectedTicket.id}`, formModal)
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedTicket(null);
        setFormModal({
          email: "",
          title: "",
          description: "",
          ticket_type_id: "",
          status: "",
          assign_at: "",
        });
        setError([]);
        fetchData();
      })
      .catch((err) => {
        setError(err.response?.data || { message: "Terjadi kesalahan." });
      });
  }

  function handleDelete() {
    axios
      .delete(`${API_URL}/${selectedTicket.id}`)
      .then(() => {
        setIsDeleteModalOpen(false);
        setSelectedTicket(null);
        setError([]);
        fetchData();
      })
      .catch((err) => {
        setError(err.response?.data || { message: "Terjadi kesalahan." });
      });
  }

  function handleBtnDetail(ticket) {
    setDetailTicket(ticket);
    setIsDetailModalOpen(true);
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end">
        <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} /> Tambah Tiket
        </button>
      </div>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Email</th>
            <th>Masalah</th>
            <th>Deskripsi</th>
            <th>Jenis Tiket</th>
            <th>Status</th>
            <th>Tanggal Masalah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tickets) && tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.email}</td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.ticket_type}</td>
                <td>{ticket.status}</td>
                <td>{ticket.assign_at}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setFormModal({
                        email: ticket.email,
                        title: ticket.title,
                        description: ticket.description,
                        ticket_type_id: ticket.ticket_type_id || "",
                        status: ticket.status,
                        assign_at: ticket.assign_at,
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleBtnDetail(ticket)}
                  >
                    <FontAwesomeIcon icon={faInfo} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Tidak ada data tiket tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Tiket Baru"
      >
        <form onSubmit={handleSubmitModal}>
          {Object.keys(error).length > 0 && (
            <div className="alert alert-danger mb-4">
              {error?.data && Object.entries(error.data).length > 0 ? (
                <ul className="mb-0">
                  {Object.entries(error.data).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              ) : (
                <div>{error.message || "Terjadi kesalahan."}</div>
              )}
            </div>
          )}

          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Nama <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) =>
                    setFormModal({ ...formModal})
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) =>
                    setFormModal({ ...formModal})
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Masalah <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) =>
                    setFormModal({ ...formModal})
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Deskripsi <span className="text-danger">*</span>
                </label>
                <textarea
                  rows="4"
                  className="form-control"
                  onChange={(e) =>
                    setFormModal({ ...formModal})
                  }
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Jenis Tiket <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setFormModal({ ...formModal})
                  }
                >
                  <option value="">-- Pilih Jenis Tiket --</option>
                  <option value="Insiden">Insiden</option>
                  <option value="Perubahan_Permintaan">
                    Perubahan Permintaan
                  </option>
                  <option value="Penugasan">Penugasan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4 gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary px-4">
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Tiket"
      >
        <form onSubmit={handleEditSubmit}>
          {Object.keys(error).length > 0 && (
            <div className="alert alert-danger mb-4">
              {error?.data && Object.entries(error.data).length > 0 ? (
                <ul className="mb-0">
                  {Object.entries(error.data).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              ) : (
                <div>{error.message || "Terjadi kesalahan."}</div>
              )}
            </div>
          )}

          <div className="row g-3">
            <div className="mb-3">
              <label className="form-label fw-bold">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={formModal.email}
                onChange={(e) =>
                  setFormModal({ ...formModal, email: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                Deskripsi <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={formModal.description}
                onChange={(e) =>
                  setFormModal({ ...formModal, description: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                Jenis Tiket <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={formModal.ticket_type}
                onChange={(e) =>
                  setFormModal({ ...formModal, ticket_type: e.target.value })
                }
              >
                <option value="">-- Pilih Jenis Tiket --</option>
                <option value="Insiden">Insiden</option>
                <option value="Perubahan_Permintaan">
                  Perubahan Permintaan
                </option>
                <option value="Penugasan">Penugasan</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                Status <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={formModal.status}
                onChange={(e) =>
                  setFormModal({ ...formModal, status: e.target.value })
                }
              >
                <option value="">-- Ubah Status --</option>
                <option value="open">open</option>
                <option value="progress">progress</option>
                <option value="closed">closed</option>
                <option value="cancel">cancel</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4 gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary px-4">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* delete modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Buku"
      >
        <div className="p-4">
          <p className="mb-4">
            Apakah Anda yakin ingin <strong>"{selectedTicket?.title}"</strong>?
          </p>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Hapus
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Tiket"
      >
        <div className="p-4">
          <div className="mb-3">
            <h5 className="fw-bold">{detailTicket.title}</h5>
            <p className="text-muted mb-4">Pengguna: {detailTicket.email}</p>
          </div>

          <div className="border-top border-bottom py-3 mb-4">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <small className="text-muted d-block">Tanggal</small>
                  <p>{detailTicket.assign_at}</p>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Jenis Tiket</small>
                  <p>{detailTicket.ticket_type}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <small className="text-muted d-block">Deskripsi</small>
            <p>{detailTicket.description}</p>
          </div>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
