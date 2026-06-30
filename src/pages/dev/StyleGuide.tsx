import { Button } from "../../components/ui/Button/Button";
import { Card } from "../../components/ui/Card/Card";
import { Badge } from "../../components/ui/Badge/Badge";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { Skeleton } from "../../components/ui/Skeleton/Skeleton";
import { CountUpNumber } from "../../components/ui/CountUpNumber/CountUpNumber";

const categoryOptions = [
  { value: "food", label: "Makanan" },
  { value: "transport", label: "Transportasi" },
  { value: "entertainment", label: "Hiburan" },
];

function ColorSwatch({ label, color, textColor = "#000000" }: { label: string; color: string; textColor?: string }) {
  return (
    <div
      className="w-24 h-24 rounded-brutal border-3 border-base-ink flex items-center justify-center font-mono text-xs font-bold"
      style={{ backgroundColor: color, color: textColor }}
    >
      {label}
    </div>
  );
}

export function StyleGuide() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="font-display font-bold text-4xl mb-2">NeoFin Style Guide</h1>
      <p className="font-body text-base mb-10 opacity-60">Design token & component reference</p>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Colors</h2>
        <div className="flex flex-wrap gap-3">
          <ColorSwatch label="base-bg" color="#F4F4F0" />
          <ColorSwatch label="base-ink" color="#000000" textColor="#FFFFFF" />
          <ColorSwatch label="base-surface" color="#FFFFFF" />
          <ColorSwatch label="accent-lime" color="#D4FF3F" />
          <ColorSwatch label="accent-pink" color="#FF3F8E" textColor="#FFFFFF" />
          <ColorSwatch label="accent-orange" color="#FF6B1A" textColor="#FFFFFF" />
          <ColorSwatch label="accent-blue" color="#3F8EFF" textColor="#FFFFFF" />
          <ColorSwatch label="success" color="#00C853" textColor="#FFFFFF" />
          <ColorSwatch label="danger" color="#FF3B30" textColor="#FFFFFF" />
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Typography</h2>
        <div className="space-y-3">
          <p className="font-display font-bold text-3xl">Space Grotesk (Display) — Bold 36px</p>
          <p className="font-body text-lg">Inter (Body) — Regular 18px</p>
          <p className="font-mono text-lg">JetBrains Mono (Mono) — 18px</p>
          <p className="font-mono tabular-nums text-2xl">0123456789 (tabular-nums)</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="danger">Delete</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Cards</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-5">
            <p className="font-display font-bold">Card Default</p>
            <p className="font-body text-sm mt-1">Hover untuk melihat shadow shift</p>
          </Card>
          <Card shadow="lg" className="p-5">
            <p className="font-display font-bold">Card Large Shadow</p>
            <p className="font-body text-sm mt-1">Shadow lebih besar</p>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="accent">Accent</Badge>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Inputs</h2>
        <div className="space-y-4 max-w-sm">
          <Input placeholder="Default input..." />
          <Input placeholder="With error..." error="Field ini wajib diisi" />
          <Select options={categoryOptions} placeholder="Pilih kategori" />
          <Select options={categoryOptions} placeholder="Dengan error" error="Pilih kategori" />
        </div>
      </section>

      {/* Skeleton */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Skeleton</h2>
        <div className="space-y-3 max-w-sm">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </section>

      {/* CountUp */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">CountUp Number</h2>
        <div className="flex gap-8">
          <div>
            <p className="font-display font-bold text-sm mb-1">Rp</p>
            <p className="font-mono tabular-nums text-3xl">
              <CountUpNumber target={25000000} />
            </p>
          </div>
          <div>
            <p className="font-display font-bold text-sm mb-1">Persentase</p>
            <p className="font-mono tabular-nums text-3xl">
              <CountUpNumber target={87} />%
            </p>
          </div>
        </div>
      </section>

      {/* Shadow tokens */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-2xl mb-4 border-b-3 border-base-ink pb-2">Shadow Tokens</h2>
        <div className="flex flex-wrap gap-4">
          <div className="shadow-brutal w-32 h-20 rounded-brutal border-3 border-base-ink bg-base-surface flex items-center justify-center font-mono text-xs font-bold">brutal</div>
          <div className="shadow-brutal-sm w-32 h-20 rounded-brutal border-3 border-base-ink bg-base-surface flex items-center justify-center font-mono text-xs font-bold">brutal-sm</div>
          <div className="shadow-brutal-lg w-32 h-20 rounded-brutal border-3 border-base-ink bg-base-surface flex items-center justify-center font-mono text-xs font-bold">brutal-lg</div>
          <div className="shadow-brutal-accent w-32 h-20 rounded-brutal border-3 border-base-ink bg-base-surface flex items-center justify-center font-mono text-xs font-bold">brutal-accent</div>
        </div>
      </section>
    </div>
  );
}
