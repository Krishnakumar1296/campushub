export function serializeUser(user) {
  return {
    id: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function serializeProfile(user) {
  return {
    id: user.userId,
    name: user.name || "",
    email: user.email || "",
    role: user.role,
    phone: user.phone || "",
    department: user.department || "",
    year: user.year || "",
    bio: user.bio || "",
  };
}

export function serializeEvent(e) {
  return {
    id: e.eventId,
    title: e.title,
    description: e.description || "",
    longDescription: e.longDescription || "",
    category: e.category || "Other",
    date: e.date,
    time: e.time || "",
    endTime: e.endTime || "",
    venue: e.venue || "",
    department: e.department || "",
    image: e.image || "",
    registered: e.registered || 0,
    capacity: e.capacity || 0,
    attended: e.attended || 0,
    registrationDeadline: e.registrationDeadline || null,
    status: e.status || "Upcoming",
    tags: Array.isArray(e.tags) ? e.tags : [],
    createdAt: e.createdAt || "",
    organizerId: e.organizerId || "",
  };
}

export function serializeRegistration(r) {
  return {
    regId: r.regId,
    eventId: r.eventId,
    studentName: r.studentName,
    studentId: r.studentId,
    email: r.email || "",
    department: r.department || "",
    year: r.year || "",
    status: r.status,
    registeredAt: r.registeredAt ? new Date(r.registeredAt).toISOString() : "",
    checkedInAt: r.checkedInAt ? new Date(r.checkedInAt).toISOString() : null,
  };
}

export function serializeNotification(n) {
  return {
    id: n._id.toString(),
    type: n.type || "info",
    title: n.title,
    message: n.message || "",
    time: n.createdAt ? new Date(n.createdAt).getTime() : 0,
    read: !!n.isRead,
  };
}
