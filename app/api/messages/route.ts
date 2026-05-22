import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendLiveChatNotificationEmail, sendVisitorReplyEmail } from "@/lib/email";

export const runtime = "nodejs";
const AUTO_REPLY_TEXT =
  process.env.LIVE_CHAT_AUTO_REPLY?.trim() ||
  "Hi! Thanks for your message. I received it and will get back to you soon.";

type MessagePayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  visitorId?: string;
  sender?: "visitor" | "admin";
  recipientEmail?: string;
  recipientName?: string;
  quotedMessage?: string;
};

type ReplyPayload = {
  id: string;
  reply: string;
};

type MarkSeenPayload = {
  visitorId: string;
  markSeen: boolean;
  email?: string;
  name?: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const visitorId = searchParams.get("visitorId")?.trim();
    const db = await getDb();
    const messages = await db
      .collection("messages")
      .find(visitorId ? { visitorId } : {})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    return NextResponse.json({ ok: true, data: messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to fetch messages.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<MessagePayload>;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();
    const visitorId = body.visitorId?.trim();
    const sender = body.sender === "admin" ? "admin" : "visitor";
    const recipientEmail = body.recipientEmail?.trim();
    const recipientName = body.recipientName?.trim();
    const quotedMessage = body.quotedMessage?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, message: "name, email and message are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection("messages").insertOne({
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
      visitorId,
      sender,
      quotedMessage: quotedMessage || "",
      status: sender === "admin" ? "replied" : "new",
      seenByAdmin: sender === "admin",
      createdAt: new Date(),
    });

    if (sender === "visitor") {
      void sendLiveChatNotificationEmail({
        senderName: name,
        senderEmail: email,
        message,
        visitorId,
      }).catch(() => {
        // ignore email errors so chat submission always succeeds
      });

      const visitorFilter = visitorId ? { visitorId } : { email, name };
      const visitorMessageCount = await db.collection("messages").countDocuments({
        ...visitorFilter,
        sender: "visitor",
      });

      if (visitorMessageCount === 1) {
        await db.collection("messages").insertOne({
          name: "Hasnat Evan",
          email: "admin@local.chat",
          phone: "",
          subject: "Auto Reply",
          message: AUTO_REPLY_TEXT,
          visitorId,
          sender: "admin",
          status: "replied",
          seenByAdmin: true,
          createdAt: new Date(),
        });
      }
    }

    if (sender === "admin" && recipientEmail) {
      const blockedEmails = new Set(["visitor@local.chat", "admin@local.chat"]);
      if (!blockedEmails.has(recipientEmail.toLowerCase())) {
        void sendVisitorReplyEmail({
          recipientEmail,
          recipientName,
          replyMessage: message,
          subject,
        }).catch(() => {
          // ignore email errors so admin reply save still succeeds
        });
      }
    }

    return NextResponse.json(
      { ok: true, message: "Message saved.", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to save message.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as Partial<ReplyPayload & MarkSeenPayload>;
    const id = body.id?.trim();
    const reply = body.reply?.trim();
    const visitorId = body.visitorId?.trim();
    const email = body.email?.trim();
    const name = body.name?.trim();
    const markSeen = body.markSeen === true;

    if (markSeen && (visitorId || email || name)) {
      const db = await getDb();
      const filter: {
        visitorId?: string;
        email?: string;
        name?: string;
        sender: { $ne: "admin" };
        seenByAdmin: { $ne: true };
      } = {
        sender: { $ne: "admin" },
        seenByAdmin: { $ne: true },
      };
      if (visitorId) {
        filter.visitorId = visitorId;
      } else {
        if (email) filter.email = email;
        if (name) filter.name = name;
      }
      await db.collection("messages").updateMany(
        filter,
        { $set: { seenByAdmin: true } }
      );
      return NextResponse.json({ ok: true, message: "Messages marked as seen." }, { status: 200 });
    }

    if (!id || !reply) {
      return NextResponse.json(
        { ok: false, message: "id and reply are required." },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid message id." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          adminReply: reply,
          repliedAt: new Date(),
          status: "replied",
        },
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { ok: false, message: "Message not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, message: "Reply saved." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to save reply.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const visitorId = searchParams.get("visitorId")?.trim();
    const id = searchParams.get("id")?.trim();
    const email = searchParams.get("email")?.trim();
    const name = searchParams.get("name")?.trim();

    const db = await getDb();

    if (visitorId) {
      const result = await db.collection("messages").deleteMany({ visitorId });
      return NextResponse.json(
        { ok: true, message: "Visitor conversation deleted.", deletedCount: result.deletedCount },
        { status: 200 }
      );
    }

    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ ok: false, message: "Invalid message id." }, { status: 400 });
      }
      const result = await db.collection("messages").deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json(
        { ok: true, message: "Message deleted.", deletedCount: result.deletedCount },
        { status: 200 }
      );
    }

    if (email || name) {
      const query: { email?: string; name?: string } = {};
      if (email) query.email = email;
      if (name) query.name = name;
      const result = await db.collection("messages").deleteMany(query);
      return NextResponse.json(
        { ok: true, message: "Visitor conversation deleted.", deletedCount: result.deletedCount },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "visitorId or id or email/name is required." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to delete message(s).", error: String(error) },
      { status: 500 }
    );
  }
}
