import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getCroppedImageDataUrl } from "@/lib/cropImage";

interface ImageCropDialogProps {
  imageSrc: string | null;
  aspect?: number;
  outputWidth?: number;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
}

export function ImageCropDialog({
  imageSrc,
  aspect = 1,
  outputWidth = 600,
  onCancel,
  onConfirm,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;
    setSaving(true);
    try {
      const outputHeight = Math.round(outputWidth / aspect);
      const dataUrl = await getCroppedImageDataUrl(
        imageSrc,
        croppedAreaPixels,
        outputWidth,
        outputHeight,
      );
      onConfirm(dataUrl);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        {imageSrc && (
          <div className="relative h-72 w-full bg-black/40 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={aspect === 1 ? "round" : "rect"}
              showGrid={aspect !== 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs text-muted-foreground shrink-0">Zoom</span>
          <Slider
            min={1}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={([v]) => setZoom(v)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving || !croppedAreaPixels}>
            {saving ? "Saving…" : "Apply crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
