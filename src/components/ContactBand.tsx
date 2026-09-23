import { Container, Eyebrow } from "./primitives";
import {
  ClockIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "./Icons";
import { carl, contact, site, whatsappUrl } from "@/content/course";

/**
 * Contact band, built on the labelled-block pattern from
 * independentadvisors.ai — DIRECT LINE / PHONE / WHATSAPP / OFFICE HOURS /
 * FOLLOW — so the two properties feel like one organisation.
 *
 * Offices are included because a UAE buyer paying AED 2,000 up front on a
 * new domain is reassured by a real address; they are presented as where
 * Carl works from, not as somewhere to visit, since the programme is online.
 */

const OFFICES = [
  {
    city: "Sharjah",
    address: "Sharjah Publishing City, Sharjah UAE",
    maps: "https://www.google.com/maps/search/?api=1&query=Sharjah%20Publishing%20City%2C%20Sharjah%20UAE",
  },
  {
    city: "Dubai",
    address: "Green Community, DIP 1, Dubai UAE",
    maps: "https://www.google.com/maps/search/?api=1&query=Green%20Community%2C%20DIP%201%2C%20Dubai%20UAE",
  },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: carl.linkedin,
    Icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/independent_advisors",
    Icon: InstagramIcon,
  },
  {
    label: "WhatsApp",
    href: whatsappUrl(`Hi Carl — I have a question about ${site.name}.`),
    Icon: WhatsAppIcon,
  },
];

export default function ContactBand() {
  return (
    <section id="contact" className="band-ink grain relative bg-ink-700 py-10 text-paper-100 sm:py-14 lg:py-20">
      <Container>
        <div className="max-w-2xl" data-reveal="up">
          <Eyebrow tone="cream" className="mb-6">
            Talk to Carl first
          </Eyebrow>
          <h2 className="font-display text-[1.7rem] leading-[1.1] tracking-[-0.02em] text-balance text-paper-100 sm:text-[2.6rem] lg:text-5xl">
            Ask before you pay.
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-pretty text-paper-300/75">
            {contact.replyPromise} No sales call, no sequence — a straight
            answer about whether this is right for your business.
          </p>
        </div>

        {/* Labelled blocks ------------------------------------------- */}
        <div
          className="mt-7 grid gap-px overflow-hidden rounded-xs bg-paper-100/10 sm:grid-cols-2 lg:grid-cols-4"
          data-reveal="up"
          style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
        >
          <ContactBlock
            label="Direct line"
            icon={<MailIcon className="h-4 w-4" />}
            href={`mailto:${contact.email}`}
            value={contact.email}
            note="Carl replies personally"
          />
          <ContactBlock
            label="Phone"
            icon={<PhoneIcon className="h-4 w-4" />}
            href={`tel:+${contact.phoneE164}`}
            value={contact.phone}
          />
          <ContactBlock
            label="WhatsApp"
            icon={<WhatsAppIcon className="h-4 w-4" />}
            href={whatsappUrl(
              `Hi Carl — I have a question about ${site.name}.`,
            )}
            value="Message Carl"
            note="Fastest route to an answer"
            external
          />
          <ContactBlock
            label="Office hours"
            icon={<ClockIcon className="h-4 w-4" />}
            value="Mon–Fri"
            note="9:00am – 4:00pm GST"
          />
        </div>

        {/* Offices + social ------------------------------------------ */}
        <div
          className="mt-8 grid gap-7 border-t border-paper-100/12 pt-7 lg:grid-cols-[1.6fr_1fr] lg:gap-14"
          data-reveal="up"
          style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500">
              Where Carl works from
            </p>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-paper-300/65">
              The programme runs online, so there is nothing to travel to —
              but the practice behind it is real, and based in the UAE.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {OFFICES.map((office) => (
                <li
                  key={office.city}
                  className="rounded-xs border border-paper-100/12 p-4"
                >
                  <p className="font-display text-lg text-paper-100">
                    {office.city}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-paper-300/65">
                    {office.address}
                  </p>
                  <a
                    href={office.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep -mx-2 mt-2 inline-flex min-h-11 items-center gap-2 px-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold-500 transition-colors hover:text-gold-400"
                  >
                    <PinIcon className="h-3.5 w-3.5" />
                    Get directions
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500">
              Follow
            </p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} — opens in a new tab`}
                    className="group flex h-11 w-11 items-center justify-center rounded-xs border border-paper-100/15 text-paper-300/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500 hover:text-gold-400"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-l-2 border-gold-500 pl-5 text-[14px] leading-relaxed text-paper-300/70">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-500">
                Independent, always
              </span>
              <br />
              Carl takes no commission from third parties. The advice in this
              programme is not selling you anything else.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ContactBlock({
  label,
  icon,
  href,
  value,
  note,
  external,
}: {
  label: string;
  icon: React.ReactNode;
  href?: string;
  value: string;
  note?: string;
  external?: boolean;
}) {
  const body = (
    <>
      <span className="flex items-center gap-2.5 text-gold-500">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
          {label}
        </span>
      </span>
      <span className="mt-2.5 block break-words font-display text-[17px] leading-snug text-paper-100 sm:mt-4 sm:text-lg">
        {value}
      </span>
      {note && (
        <span className="mt-1.5 block text-[13px] leading-relaxed text-paper-300/65">
          {note}
        </span>
      )}
    </>
  );

  const classes =
    "block bg-ink-700 px-5 py-4 transition-colors duration-300 sm:p-5 lg:p-6";

  if (!href) return <div className={classes}>{body}</div>;

  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`${classes} hover:bg-ink-600`}
    >
      {body}
    </a>
  );
}
