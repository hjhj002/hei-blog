(function (global) {
  "use strict";

  var FALLBACK = {
    frameCount: 391,
    fps: 60,
  };

  var clamp = function (value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  var wrap = function (value, length) {
    return ((value % length) + length) % length;
  };

  var shortestCircularDelta = function (from, to, frameCount) {
    var delta = wrap(to, frameCount) - wrap(from, frameCount);
    if (delta > frameCount / 2) delta -= frameCount;
    if (delta < -frameCount / 2) delta += frameCount;
    return delta;
  };

  var smoothDamp = function (current, target, velocity, smoothTime, deltaTime) {
    var safeTime = Math.max(0.0001, smoothTime);
    var omega = 2 / safeTime;
    var x = omega * deltaTime;
    var decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    var change = current - target;
    var temp = (velocity + omega * change) * deltaTime;
    var nextVelocity = (velocity - omega * temp) * decay;
    var nextPosition = target + (change + temp) * decay;
    return [nextPosition, nextVelocity];
  };

  var createFrameAnimator = function (frameCount, smoothTime) {
    var position = 0;
    var target = 0;
    var velocity = 0;
    var lastRendered = -1;
    var lastTime = 0;
    var raf = 0;
    var destroyed = false;
    var onFrame = null;

    var step = function (now) {
      if (destroyed) return;
      var deltaTime = lastTime ? (now - lastTime) / 1000 : 1 / 60;
      lastTime = now;
      deltaTime = clamp(deltaTime, 0, 0.1);

      var delta = shortestCircularDelta(position, target, frameCount);
      // 到位后立刻停下，空闲时不再空转 rAF。
      if (Math.abs(delta) < 0.02 && Math.abs(velocity) < 0.02) {
        position = wrap(target, frameCount);
        velocity = 0;
        var settled = Math.round(position) % frameCount;
        if (settled !== lastRendered) {
          lastRendered = settled;
          if (onFrame) onFrame(settled);
        }
        raf = 0;
        return;
      }
      var damped = smoothDamp(0, delta, velocity, smoothTime, deltaTime);
      velocity = damped[1];
      position = wrap(position + damped[0], frameCount);

      var rounded = Math.round(position) % frameCount;
      if (rounded !== lastRendered) {
        lastRendered = rounded;
        if (onFrame) onFrame(rounded);
      }
      raf = global.requestAnimationFrame(step);
    };

    return {
      start: function () {
        if (raf) return;
        lastTime = 0;
        raf = global.requestAnimationFrame(step);
      },
      stop: function () {
        if (raf) {
          global.cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      setTargetFrame: function (frame) {
        target = frame;
      },
      setTargetAngle: function (angle, startAngle) {
        var turn = Math.PI * 2;
        var start = typeof startAngle === "number" ? startAngle : -Math.PI / 2;
        var normalized = ((angle - start + turn) % turn) / turn;
        target = normalized * frameCount;
      },
      setOnFrame: function (fn) {
        onFrame = fn;
      },
      destroy: function () {
        destroyed = true;
        this.stop();
      },
    };
  };

  var KittenWidget = {
    create: function (root, options) {
      options = options || {};
      var container =
        typeof root === "string" ? document.querySelector(root) : root;
      if (!container) throw new Error("KittenWidget: container not found");

      var config = {
        manifestUrl: options.manifestUrl || "compile.json",
        desktop: options.desktop || "desktop.webm",
        mobile: options.mobile || "mobile.webm",
        poster: options.poster || "poster.png",
        frameCount: options.frameCount || FALLBACK.frameCount,
        fps: options.fps || FALLBACK.fps,
        startAngle:
          typeof options.startAngle === "number"
            ? options.startAngle
            : -Math.PI / 2,
        mobileBreakpoint: options.mobileBreakpoint || 768,
        smoothTime: options.smoothTime != null ? options.smoothTime : 0.06,
        reducedMotion: options.reducedMotion === true,
        // "window"：监听整个视口的鼠标，猫始终看向指针；"element"：只在猫容器内跟踪。
        track: options.track || "window",
      };

      container.classList.add("kitten-widget");

      var video = document.createElement("video");
      video.className = "kitten-source";
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.preload = "auto";

      var poster = document.createElement("img");
      poster.className = "kitten-poster";
      poster.alt = "";
      poster.src = config.poster;

      container.appendChild(video);
      container.appendChild(poster);

      var destroyed = false;
      var reduced =
        config.reducedMotion ||
        global.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var animator = createFrameAnimator(config.frameCount, config.smoothTime);
      var mediaReady = false;

      var resolveMedia = function () {
        var mobile = global.innerWidth < config.mobileBreakpoint;
        return mobile ? config.mobile : config.desktop;
      };

      var showPoster = function () {
        video.style.display = "none";
        poster.style.display = "block";
      };

      var showVideo = function () {
        video.style.display = "block";
        poster.style.display = "none";
      };

      // 拖动时合并过时的 seek：一次只保留最新目标帧，避免 seek 堆积导致卡顿。
      var pendingTime = null;
      var applyTime = function (time) {
        pendingTime = null;
        video.currentTime = time;
      };
      video.addEventListener("seeked", function () {
        if (pendingTime != null) applyTime(pendingTime);
      });
      var renderFrame = function (frame) {
        if (!mediaReady || video.readyState < 2) return;
        var time = frame / config.fps;
        if (video.seeking) {
          pendingTime = time;
          return;
        }
        if (Math.abs(video.currentTime - time) > 1 / config.fps / 2) {
          applyTime(time);
        }
      };
      animator.setOnFrame(renderFrame);

      var onPointerMove = function (event) {
        var point = event && event.touches ? event.touches[0] : event;
        if (!point) return;
        var rect = container.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = point.clientX - cx;
        var dy = point.clientY - cy;
        if (!dx && !dy) return; // 指针正好在正中：保持上一方向，避免 atan2(0,0)=0 跳变
        animator.setTargetAngle(Math.atan2(dy, dx), config.startAngle);
        animator.start();
      };

      var onBlur = function () {
        animator.stop();
      };

      var trackOnWindow = config.track !== "element";
      var trackTarget = trackOnWindow ? global : container;
      trackTarget.addEventListener("pointermove", onPointerMove, { passive: true });
      trackTarget.addEventListener("touchmove", onPointerMove, { passive: true });
      if (trackOnWindow) {
        global.addEventListener("blur", onBlur);
      } else {
        container.addEventListener("pointerleave", onBlur);
      }

      var loadManifest = function () {
        return global
          .fetch(config.manifestUrl)
          .then(function (response) {
            if (!response.ok) throw new Error("manifest failed");
            return response.json();
          })
          .then(function (manifest) {
            var runtime = manifest && manifest.runtime ? manifest.runtime : {};
            if (!options.frameCount && runtime.frameCount) {
              config.frameCount = runtime.frameCount;
            }
            if (!options.fps && runtime.fps) config.fps = runtime.fps;
            if (manifest && manifest.runtime && manifest.runtime.assets) {
              var assets = manifest.runtime.assets;
              if (!options.desktop && assets.desktop) config.desktop = assets.desktop;
              if (!options.mobile && assets.mobile) config.mobile = assets.mobile;
              if (!options.poster && assets.poster) config.poster = assets.poster;
            }
          })
          .catch(function () {
            /* 清单缺失时使用默认值 */
          });
      };

      var initVideo = function () {
        if (reduced) {
          showPoster();
          return Promise.resolve();
        }
        video.src = resolveMedia();
        return new Promise(function (resolve) {
          var done = false;
          var finish = function () {
            if (done) return;
            done = true;
            resolve();
          };
          video.addEventListener("loadeddata", function () {
            mediaReady = true;
            showVideo();
            video.currentTime = 0;
            finish();
          });
          video.addEventListener("error", function () {
            showPoster();
            finish();
          });
          video.load();
        });
      };

      loadManifest()
        .then(function () {
          animator.destroy();
          animator = createFrameAnimator(config.frameCount, config.smoothTime);
          animator.setOnFrame(renderFrame);
          if (!reduced) animator.start();
          return initVideo();
        })
        .catch(function () {
          showPoster();
        });

      var onResize = function () {
        var src = resolveMedia();
        if (!reduced && mediaReady && video.getAttribute("src") !== src) {
          video.src = src;
          video.load();
        }
      };
      global.addEventListener("resize", onResize);

      return {
        destroy: function () {
          if (destroyed) return;
          destroyed = true;
          animator.destroy();
          trackTarget.removeEventListener("pointermove", onPointerMove);
          trackTarget.removeEventListener("touchmove", onPointerMove);
          if (trackOnWindow) {
            global.removeEventListener("blur", onBlur);
          } else {
            container.removeEventListener("pointerleave", onBlur);
          }
          global.removeEventListener("resize", onResize);
          if (video.parentNode) video.parentNode.removeChild(video);
          if (poster.parentNode) poster.parentNode.removeChild(poster);
        },
      };
    },
  };

  global.KittenWidget = KittenWidget;
})(typeof window !== "undefined" ? window : globalThis);
