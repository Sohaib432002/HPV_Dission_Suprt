import { ArrowRight, Download, FolderOpen, HardDrive, Image as ImageIcon, Images, Upload, Wifi } from 'lucide-react'
import { Container, LinkButton, SectionHeading } from '../ui'
import { buttonClass } from '../ui/buttonStyles'
import {
  SAMPLE_IMAGES_BROWSE_URL,
  SAMPLE_IMAGES_COUNT,
  SAMPLE_IMAGES_SIZE,
  SAMPLE_IMAGES_ZIP_URL,
  asset,
} from '../../lib/config'

const previews = [1, 2, 3, 4, 5, 6]

const steps = [
  { title: 'Download', text: 'Press the green button. A ZIP file (one folder of pictures) is saved to your computer.' },
  { title: 'Open the ZIP', text: 'Right-click the file and choose “Extract All” (Windows) or double-click it (Mac).' },
  { title: 'Go to “Check cell pictures”', text: 'Log in, then open the Prediction page from the top menu.' },
  { title: 'Add a few pictures', text: 'Drag 3 to 5 pictures from the folder into the upload box. You do not need all of them.' },
]

const SampleImages = () => (
  <div>
    <section className="bg-gradient-to-b from-brand-soft to-bg">
      <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Try it yourself</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Sample images to <span className="text-brand">try the website</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
            No pictures of your own yet? These are example microscope pictures of cervical cells. Download them
            and upload a few to <strong className="text-ink">Check cell pictures</strong> to see how the website
            counts cells and shows its results.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={SAMPLE_IMAGES_ZIP_URL}
              download
              rel="noopener"
              className={buttonClass({ size: 'lg', className: 'shadow-pop' })}
            >
              <Download className="h-5 w-5" aria-hidden /> Download Sample Images
            </a>
            <a
              href={SAMPLE_IMAGES_BROWSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ size: 'lg', variant: 'secondary' })}
            >
              <FolderOpen className="h-5 w-5" aria-hidden /> See all pictures
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-2">
            <li className="flex items-center gap-2">
              <Images className="h-4 w-4 text-brand" aria-hidden /> {SAMPLE_IMAGES_COUNT.toLocaleString()} pictures
            </li>
            <li className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-brand" aria-hidden /> {SAMPLE_IMAGES_SIZE} in a ZIP file
            </li>
            <li className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-brand" aria-hidden /> JPG format
            </li>
          </ul>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <Wifi className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            The ZIP is large. Use Wi-Fi and allow a few minutes. Short on time or data? Download single pictures
            from the gallery below instead.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3" aria-hidden>
          {previews.map((n) => (
            <img
              key={n}
              src={asset(`sample-previews/sample-${n}.jpg`)}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded-2xl object-cover shadow-card ring-1 ring-line"
            />
          ))}
        </div>
      </Container>
    </section>

    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="How to use them"
          title="Four easy steps"
          description="You do not need any special software."
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-display text-base font-bold text-brand-fg">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-center">
          <LinkButton to="/future-predict" variant="secondary" size="lg">
            <Upload className="h-4 w-4" aria-hidden /> Go to Check cell pictures <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>
      </Container>
    </section>

    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Quick download"
          title="Just need one or two?"
          description="Save any of these pictures directly. They are a small selection from the full set."
        />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {previews.map((n) => (
            <li key={n} className="overflow-hidden rounded-2xl border border-line bg-bg shadow-card">
              <img
                src={asset(`sample-previews/sample-${n}.jpg`)}
                alt={`Sample microscope picture ${n}`}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <a
                href={asset(`sample-previews/sample-${n}.jpg`)}
                download={`sample-image-${n}.jpg`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
              >
                <Download className="h-4 w-4" aria-hidden /> Save
              </a>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted">
          These pictures are for trying the website. Results on sample pictures are for practice only and are not
          a medical opinion.
        </p>
      </Container>
    </section>
  </div>
)

export default SampleImages
