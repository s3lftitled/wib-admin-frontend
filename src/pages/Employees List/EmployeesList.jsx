import Sidebar from '../../components/Sidebar/Sidebar'
import './EmployeesList.css'
import { useEffect, useState } from 'react'

// Sample employee data - replace with your API call
const sampleEmployees = [
    {
        id: 1,
        name: "Liny Demonteverde",
        position: "Developer",
        department: "IT",
        email: "liny@company.com",
        phone: "+1 (555) 123-4567",
        status: "active",
        hireDate: "2022-03-15"
    },
    {
        id: 2,
        name: "Janna Bibat",
        position: "UX/UI Designer",
        department: "Marketing/IT",
        email: "bibat@company.com",
        phone: "+1 (555) 234-5678",
        status: "active",
        hireDate: "2021-07-20"
    },
    {
        id: 3,
        name: "Uswa Obina",
        position: "Developer",
        department: "IT",
        email: "obina@company.com",
        phone: "+1 (555) 345-6789",
        status: "inactive",
        hireDate: "2023-01-10"
    },
    {
        id: 4,
        name: "Vicento Bien",
        position: "Developer",
        department: "IT",
        email: "bien@company.com",
        phone: "+1 (555) 456-7890",
        status: "active",
        hireDate: "2022-09-05"
    },
    {
        id: 5,
        name: "Rosalie Bazar",
        position: "UX/UI Designer",
        department: "Marketing/IT",
        email: "bazar@company.com",
        phone: "+1 (555) 567-8901",
        status: "active",
        hireDate: "2023-02-28"
    },
    {
        id: 6,
        name: "Francisco Ortiguero",
        position: "UX/UI Designer",
        department: "Marketing/IT",
        email: "francisco@company.com",
        phone: "+1 (555) 678-9012",
        status: "active",
        hireDate: "2020-11-12"
    }
]

const EmployeesList = () => {
    const [isSidebarActive, setSidebarActive] = useState(false)
    const [employees, setEmployees] = useState([])
    const [filteredEmployees, setFilteredEmployees] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        status: 'active',
        hireDate: ''
    })

    useEffect(() => {
        const loadEmployees = () => {
            setTimeout(() => {
                setEmployees(sampleEmployees)
                setFilteredEmployees(sampleEmployees)
                setLoading(false)
            }, 1000)
        }

        loadEmployees()
    }, [])

    useEffect(() => {
        let filtered = employees

        if (searchTerm) {
            filtered = filtered.filter(employee =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(employee => employee.status === statusFilter)
        }

        setFilteredEmployees(filtered)
    }, [employees, searchTerm, statusFilter])

    const toggleSidebar = () => {
        setSidebarActive(!isSidebarActive)
    }

    const handleOverlayClick = () => {
        if (isSidebarActive) {
            toggleSidebar()
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isSidebarActive) {
            toggleSidebar()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isSidebarActive])

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const getActiveEmployeesCount = () => {
        return employees.filter(emp => emp.status === 'active').length
    }

    const handleAddEmployee = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />

            <div className="employeesList-container">
                <div className="employeesList-header">
                    <h2 className="employeesList-title">Employees List</h2>
                    <div className="employees-count">
                        {getActiveEmployeesCount()} Active Employees • {employees.length} Total
                    </div>
                </div>

                <div className="employee-container">
                    {!loading && (
                        <div className="employees-controls">
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <button
                                className="add-employee-btn"
                                onClick={handleAddEmployee}
                            >
                                + Add Employee
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="empty-state">
                            <h3>No employees found</h3>
                            <p>
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Start by adding your first employee'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="employees-grid">
                            {filteredEmployees.map((employee) => (
                                <div key={employee.id} className="employee-card">
                                    <div className="employee-info">
                                        <div className="employee-avatar">
                                            {getInitials(employee.name)}
                                        </div>
                                        <div className="employee-details">
                                            <h3>{employee.name}</h3>
                                            <p>{employee.position}</p>
                                            <p>{employee.department}</p>
                                            <p>{employee.email}</p>
                                            <p>{employee.phone}</p>
                                        </div>
                                    </div>
                                    <div className={`employee-status status-${employee.status}`}>
                                        {employee.status.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        {/* Modal content will be added here */}
                    </div>
                </div>
            )}
        </>
    )
}

export default EmployeesList    