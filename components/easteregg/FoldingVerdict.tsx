"use client";

import { useEffect, useRef } from "react";

interface FoldingVerdictProps {
  onFoldComplete: () => void;
}

export function FoldingVerdict({ onFoldComplete }: FoldingVerdictProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let foldAngle = 0;
    let isDragging = false;
    let dragStartX = 0,
      dragStartY = 0,
      dragStartAngle = 0;
    let triggered = false;
    let animationFrameId: number;
    let hintTimeout: NodeJS.Timeout;

    const W = 280,
      H = 280;
    const SX = 20,
      SY = 20,
      SW = 240,
      SH = 240;
    const A = { x: SX + SW, y: SY };
    const B = { x: SX + SW, y: SY + SH };
    const C = { x: SX, y: SY + SH };
    const D = { x: SX, y: SY };

    const axisVec = { x: C.x - A.x, y: C.y - A.y };
    const axisLen = Math.sqrt(axisVec.x ** 2 + axisVec.y ** 2);
    const axisUnit = { x: axisVec.x / axisLen, y: axisVec.y / axisLen };

    function projectOntoAxis(p: { x: number; y: number }) {
      const ap = { x: p.x - A.x, y: p.y - A.y };
      const t = ap.x * axisUnit.x + ap.y * axisUnit.y;
      return {
        foot: { x: A.x + t * axisUnit.x, y: A.y + t * axisUnit.y },
        t,
        perp: { x: ap.x - t * axisUnit.x, y: ap.y - t * axisUnit.y },
      };
    }

    const projB = projectOntoAxis(B);
    const perpLen = Math.sqrt(projB.perp.x ** 2 + projB.perp.y ** 2);
    const perpUnit = { x: projB.perp.x / perpLen, y: projB.perp.y / perpLen };
    const upUnit = { x: -axisUnit.y, y: axisUnit.x };

    function foldedPoint(p: { x: number; y: number }, angle: number) {
      const proj = projectOntoAxis(p);
      const pLen = Math.sqrt(proj.perp.x ** 2 + proj.perp.y ** 2);
      const sign = proj.perp.x * perpUnit.x + proj.perp.y * perpUnit.y > 0 ? 1 : -1;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const fx =
        proj.foot.x + sign * pLen * cosA * perpUnit.x - sign * pLen * sinA * upUnit.x * 0.35;
      const fy =
        proj.foot.y + sign * pLen * cosA * perpUnit.y - sign * pLen * sinA * upUnit.y * 0.35;
      return { x: fx, y: fy };
    }

    function getTransform(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number,
      u1: number,
      v1: number,
      u2: number,
      v2: number,
      u3: number,
      v3: number
    ) {
      const sx1 = x2 - x1,
        sy1 = y2 - y1;
      const sx2 = x3 - x1,
        sy2 = y3 - y1;
      const dx1 = u2 - u1,
        dy1 = v2 - v1;
      const dx2 = u3 - u1,
        dy2 = v3 - v1;

      const det = sx1 * sy2 - sx2 * sy1;
      if (Math.abs(det) < 1e-6) return null;

      const a = (dx1 * sy2 - dx2 * sy1) / det;
      const b = (dy1 * sy2 - dy2 * sy1) / det;
      const c = (sx1 * dx2 - sx2 * dx1) / det;
      const d = (sx1 * dy2 - sx2 * dy1) / det;
      const e = u1 - a * x1 - c * y1;
      const f = v1 - b * x1 - d * y1;

      return [a, b, c, d, e, f];
    }

    function drawStampContent(ctx: CanvasRenderingContext2D) {
      ctx.strokeStyle = "rgba(235, 232, 225, 0.05)";
      ctx.lineWidth = 2;
      ctx.strokeRect(SX, SY, SW, SH);

      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 4;
      ctx.strokeRect(SX + 12, SY + 12, SW - 24, SH - 24);

      ctx.lineWidth = 1.5;
      ctx.strokeRect(SX + 20, SY + 20, SW - 40, SH - 40);

      const cx = SX + SW / 2;
      const cy = SY + SH / 2;

      ctx.fillStyle = "#b45309";
      ctx.font = "900 24px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      (ctx as any).letterSpacing = "4px";
      ctx.fillText("OFFICIAL", cx, cy - 14);
      ctx.fillText("VERDICT", cx, cy + 14);
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(D.x, D.y);
      ctx.lineTo(A.x, A.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.fillStyle = "#1c1c1c";
      ctx.fill();
      ctx.clip();
      drawStampContent(ctx);
      ctx.restore();

      if (foldAngle > 0.05) {
        const fB = foldedPoint(B, foldAngle);
        const shadowAlpha = Math.sin(foldAngle) * 0.4;
        ctx.save();
        ctx.globalAlpha = shadowAlpha;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(A.x + 4, A.y + 4);
        ctx.lineTo(fB.x + 4, fB.y + 4);
        ctx.lineTo(C.x + 4, C.y + 4);
        ctx.closePath();
        ctx.filter = "blur(8px)";
        ctx.fill();
        ctx.restore();
      }

      const fA = foldedPoint(A, foldAngle);
      const fB = foldedPoint(B, foldAngle);
      const fC = foldedPoint(C, foldAngle);

      ctx.save();
      const m = getTransform(A.x, A.y, B.x, B.y, C.x, C.y, fA.x, fA.y, fB.x, fB.y, fC.x, fC.y);

      if (m) {
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);

        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = "#1c1c1c";
        ctx.fill();

        drawStampContent(ctx);

        const shade = Math.min(0.65, Math.sin(foldAngle) * 0.8);
        ctx.fillStyle = `rgba(0, 0, 0, ${shade})`;
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(C.x, C.y);
      ctx.strokeStyle = "rgba(235, 232, 225, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(fB.x, fB.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180, 83, 9, 0.1)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(fB.x, fB.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180, 83, 9, 0.6)";
      ctx.fill();
      ctx.restore();
    }

    function getFoldedB() {
      return foldedPoint(B, foldAngle);
    }

    function hitHandle(x: number, y: number) {
      const fb = getFoldedB();
      return Math.hypot(x - fb.x, y - fb.y) < 40;
    }

    function deltaToAngle(dx: number, dy: number) {
      const proj = -(dx * perpUnit.x + dy * perpUnit.y);
      return (proj / perpLen) * Math.PI;
    }

    function animateTo(target: number, dur = 300, callback?: () => void) {
      const start = foldAngle,
        t0 = performance.now();
      function step(now: number) {
        let p = (now - t0) / dur;
        if (p > 1) p = 1;
        const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        foldAngle = start + (target - start) * e;
        draw();
        if (p < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else if (callback) {
          callback();
        }
      }
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(step);
    }

    const getCoords = (e: MouseEvent | TouchEvent, isTouch: boolean) => {
      if (!canvas) return { x: 0, y: 0 };
      const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const onDown = (x: number, y: number) => {
      if (hitHandle(x, y)) {
        isDragging = true;
        dragStartX = x;
        dragStartY = y;
        dragStartAngle = foldAngle;
        if (canvas) canvas.style.cursor = "grabbing";
      }
    };

    const onMove = (x: number, y: number) => {
      if (!isDragging) {
        if (canvas) {
          if (hitHandle(x, y)) {
            canvas.style.cursor = "grab";
          } else {
            canvas.style.cursor = "default";
          }
        }
        return;
      }
      const da = deltaToAngle(x - dragStartX, y - dragStartY);
      foldAngle = Math.max(0, Math.min(Math.PI, dragStartAngle + da));
      draw();
    };

    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      if (canvas) canvas.style.cursor = "default";

      if (foldAngle > Math.PI * 0.6) {
        animateTo(Math.PI, 200, () => {
          if (!triggered) {
            triggered = true;
            onFoldComplete();
            setTimeout(() => {
              foldAngle = 0;
              triggered = false;
              draw();
            }, 500);
          }
        });
      } else {
        animateTo(0, 300);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const { x, y } = getCoords(e, false);
      onDown(x, y);
    };
    const handleTouchStart = (e: TouchEvent) => {
      const { x, y } = getCoords(e, true);
      onDown(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = getCoords(e, false);
      onMove(x, y);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const { x, y } = getCoords(e, true);
      onMove(x, y);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);

    draw();

    hintTimeout = setTimeout(() => {
      if (!isDragging && foldAngle === 0) {
        animateTo(Math.PI * 0.15, 300, () => {
          if (!isDragging) {
            animateTo(0, 300);
          }
        });
      }
    }, 1000);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(hintTimeout);
    };
  }, [onFoldComplete]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      className="h-[85px] w-[85px] touch-none md:h-[120px] md:w-[120px]"
      style={{ cursor: "default" }}
    />
  );
}
