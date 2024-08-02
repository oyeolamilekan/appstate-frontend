import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { useEffect, useRef, useState } from "react";
import { ImagePreview } from "./image-preview";

type GalleryProps = {
  images: string[]
  isRemoveButtonVisible?: boolean
  onDelete?: (imageUrl: string) => void
};

const TRANSLATE_AMOUNT = 200;

export function Gallery({ images, isRemoveButtonVisible = false, onDelete }: GalleryProps) {
  const [translate, setTranslate] = useState(0);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;
    const observer = new ResizeObserver(entries => {
      const container = entries[0]?.target;
      if (container == null) return;
      setIsLeftVisible(translate > 0);
      setIsRightVisible(translate + container.clientWidth < container.scrollWidth);
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [images, translate]);

  return (
    <div className="overflow-x-hidden relative" ref={containerRef}>
      <div
        className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]"
        style={{ transform: `translateX(-${translate}px)` }}
      >
        {images.map((image, index) => (
          <>
            <ImagePreview
              url={image}
              key={index}
              size={'large'}
              type="url"
              isRemoveButtonVisible={isRemoveButtonVisible}
              onRemove={onDelete ? () => onDelete(image) : undefined}
            />
          </>
        ))}
      </div>
      {isLeftVisible && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-full flex items-center justify-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setTranslate(translate => {
                const newTranslate = translate - TRANSLATE_AMOUNT;
                if (newTranslate <= 0) return 0;
                return newTranslate;
              });
            }}
          >
            <ChevronLeft />
          </Button>
        </div>
      )}
      {isRightVisible && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-full flex items-center justify-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setTranslate(translate => {
                if (containerRef.current === null) {
                  return translate;
                }
                const newTranslate = translate + TRANSLATE_AMOUNT;
                const edge = containerRef.current?.scrollWidth as number;
                const width = containerRef.current?.clientWidth as number;
                if (newTranslate + width >= edge) {
                  return edge - width;
                }
                return newTranslate;
              });
            }}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
