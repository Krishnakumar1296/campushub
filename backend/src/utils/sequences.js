import Counter from "../models/Counter.js";

export async function nextSeq(key, minNext = 1) {
  const counter = await Counter.findByIdAndUpdate(
    key,
    [
      {
        $set: {
          seq: {
            $max: [{ $add: [{ $ifNull: ["$seq", minNext - 1] }, 1] }, minNext],
          },
        },
      },
    ],
    { new: true, upsert: true }
  );
  return counter.seq;
}

const pad4 = (n) => String(n).padStart(4, "0");

export async function nextUserId(prefix) {
  const n = await nextSeq(`user_${prefix}`, 1001);
  return `${prefix}-${pad4(n)}`;
}

export async function nextRegId() {
  const n = await nextSeq("registration", 1027);
  return `REG-${new Date().getFullYear()}-${pad4(n)}`;
}
