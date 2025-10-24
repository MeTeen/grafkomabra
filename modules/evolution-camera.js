/**
 * EVOLUTION CAMERA ANIMATION SYSTEM (TIER S)
 *
 * Cinematic camera movements during Pokemon evolution:
 * - Build-up: Slow zoom in
 * - Peak: 360° orbit around Pokemon
 * - Morphing: Dynamic zoom out
 * - Settling: Return to default position
 */

class EvolutionCamera {
    constructor() {
        // Default camera position
        this.defaultPosition = [0, 2, 8];
        this.defaultTarget = [0, 1, 0];
        this.defaultUp = [0, 1, 0];

        // Current camera state
        this.position = [...this.defaultPosition];
        this.target = [...this.defaultTarget];
        this.up = [...this.defaultUp];

        // Animation state
        this.isAnimating = false;
        this.phase = null;
        this.progress = 0;

        // Camera shake
        this.shakeIntensity = 0;
        this.shakeTime = 0;
    }

    /**
     * Start camera animation for evolution phase
     */
    startAnimation(phase) {
        this.isAnimating = true;
        this.phase = phase;
        this.progress = 0;
    }

    /**
     * Update camera position based on evolution phase
     */
    update(deltaTime, phase, progress) {
        this.phase = phase;
        this.progress = progress;

        // Update shake
        if (this.shakeIntensity > 0) {
            this.shakeTime += deltaTime * 50;
            this.shakeIntensity *= 0.95; // Decay
        }

        // Calculate camera position based on phase
        switch (phase) {
            case 'build-up':
                this.animateBuildUp(progress);
                break;
            case 'peak':
                this.animatePeak(progress);
                this.shakeIntensity = 0.15; // Screen shake at peak
                break;
            case 'morphing':
                this.animateMorphing(progress);
                break;
            case 'settling':
                this.animateSettling(progress);
                break;
            default:
                this.resetToDefault();
        }

        // Apply camera shake
        this.applyShake();
    }

    /**
     * Build-up phase: Zoom in slowly
     */
    animateBuildUp(t) {
        const eased = this.easeInOutCubic(t);
        const distance = 8 - eased * 2; // 8 -> 6
        const height = 2 + Math.sin(t * Math.PI) * 0.3; // Slight bounce

        this.position = [0, height, distance];
        this.target = [0, 1 + eased * 0.2, 0]; // Look slightly higher
    }

    /**
     * Peak phase: 360° orbit around Pokemon
     */
    animatePeak(t) {
        const angle = t * Math.PI * 2 * 2; // 2 full rotations
        const distance = 6;
        const height = 2 + Math.sin(t * Math.PI * 4) * 0.4; // Wave up and down

        this.position = [
            Math.sin(angle) * distance,
            height,
            Math.cos(angle) * distance
        ];
        this.target = [0, 1.2, 0]; // Look at Pokemon center
    }

    /**
     * Morphing phase: Zoom out to see full transformation
     */
    animateMorphing(t) {
        const eased = this.easeInOutCubic(t);
        const distance = 6 + eased * 3; // 6 -> 9
        const height = 2 + Math.sin(t * Math.PI) * 0.5;
        const circleT = t * 0.3; // Slight rotation

        this.position = [
            Math.sin(circleT * Math.PI * 2) * distance,
            height,
            Math.cos(circleT * Math.PI * 2) * distance
        ];
        this.target = [0, 1, 0];
    }

    /**
     * Settling phase: Return to default smoothly
     */
    animateSettling(t) {
        const eased = this.easeOutElastic(t);

        this.position = this.lerp3(
            [Math.sin(0.3 * Math.PI * 2) * 9, 2.5, Math.cos(0.3 * Math.PI * 2) * 9],
            this.defaultPosition,
            eased
        );
        this.target = this.lerp3([0, 1, 0], this.defaultTarget, eased);
    }

    /**
     * Apply camera shake effect
     */
    applyShake() {
        if (this.shakeIntensity > 0.01) {
            const shake = [
                (Math.sin(this.shakeTime * 10) + Math.sin(this.shakeTime * 23)) * this.shakeIntensity,
                (Math.cos(this.shakeTime * 13) + Math.cos(this.shakeTime * 19)) * this.shakeIntensity,
                (Math.sin(this.shakeTime * 17) + Math.cos(this.shakeTime * 29)) * this.shakeIntensity * 0.5
            ];

            this.position[0] += shake[0];
            this.position[1] += shake[1];
            this.position[2] += shake[2];
        }
    }

    /**
     * Reset camera to default position
     */
    resetToDefault() {
        this.position = [...this.defaultPosition];
        this.target = [...this.defaultTarget];
        this.up = [...this.defaultUp];
        this.shakeIntensity = 0;
    }

    /**
     * Get view matrix for rendering
     */
    getViewMatrix() {
        return Mat4.lookAt(this.position, this.target, this.up);
    }

    /**
     * Trigger camera shake
     */
    shake(intensity = 0.2) {
        this.shakeIntensity = intensity;
        this.shakeTime = 0;
    }

    // Easing functions
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 :
            Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    // Vector interpolation
    lerp3(a, b, t) {
        return [
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t,
            a[2] + (b[2] - a[2]) * t
        ];
    }
}
