export interface Job {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  employer: string
  status: "open" | "in_progress" | "completed" | "cancelled"
  applicants: string[]
  selectedFreelancer?: string
  createdAt: Date
  completedAt?: Date
  nftTokenId?: string
}

export interface User {
  address: string
  role: "employer" | "freelancer" | "both"
  name?: string
}

export interface Application {
  id: string
  jobId: string
  freelancer: string
  message: string
  appliedAt: Date
  status: "pending" | "accepted" | "rejected"
}
