/**
 * EVOLUTION PARTICLE SYSTEM (TIER S)
 *
 * Multiple particle effects for evolution:
 * - Sparkles/stars orbiting Pokemon
 * - Psychic energy orbs
 * - DNA helix particles
 * - Energy burst at peak
 */

class ParticleSystem {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.particles = [];
        this.maxParticles = 500;

        // Create particle buffer
        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;

        // Position buffer (will be updated each frame)
        this.positionBuffer = gl.createBuffer();

        // Color buffer
        this.colorBuffer = gl.createBuffer();

        // Size buffer
        this.sizeBuffer = gl.createBuffer();
    }

    /**
     * Create particle effect for evolution phase
     */
    emitEvolutionParticles(phase, pokemonPosition, count = 20) {
        switch (phase) {
            case 'build-up':
                this.emitOrbitingSparkles(pokemonPosition, count);
                break;
            case 'peak':
                this.emitExplosion(pokemonPosition, count * 3);
                this.emitDNAHelix(pokemonPosition, 30);
                break;
            case 'morphing':
                this.emitPsychicOrbs(pokemonPosition, count);
                break;
            case 'settling':
                this.emitSettlingSparkles(pokemonPosition, count / 2);
                break;
        }
    }

    /**
     * Orbiting sparkles around Pokemon
     */
    emitOrbitingSparkles(center, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 2;
            const height = Math.random() * 3;

            this.particles.push({
                position: [
                    center[0] + Math.cos(angle) * radius,
                    center[1] + height,
                    center[2] + Math.sin(angle) * radius
                ],
                velocity: [
                    Math.cos(angle) * 0.5,
                    (Math.random() - 0.5) * 0.3,
                    Math.sin(angle) * 0.5
                ],
                color: [
                    0.9 + Math.random() * 0.1,
                    0.7 + Math.random() * 0.3,
                    0.2 + Math.random() * 0.3,
                    1.0
                ],
                size: 3 + Math.random() * 5,
                life: 1.0,
                decay: 0.5 + Math.random() * 0.5,
                type: 'sparkle'
            });
        }
    }

    /**
     * Explosion burst at peak evolution
     */
    emitExplosion(center, count) {
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 2 + Math.random() * 3;

            const velocity = [
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed,
                Math.cos(phi) * speed
            ];

            this.particles.push({
                position: [...center],
                velocity: velocity,
                color: [
                    0.8 + Math.random() * 0.2,
                    0.4 + Math.random() * 0.4,
                    1.0,
                    1.0
                ],
                size: 4 + Math.random() * 6,
                life: 1.0,
                decay: 1.5 + Math.random(),
                type: 'burst'
            });
        }
    }

    /**
     * DNA helix particles rising up
     */
    emitDNAHelix(center, count) {
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const angle = t * Math.PI * 8; // Multiple turns
            const radius = 0.5;
            const height = t * 4 - 2;

            this.particles.push({
                position: [
                    center[0] + Math.cos(angle) * radius,
                    center[1] + height,
                    center[2] + Math.sin(angle) * radius
                ],
                velocity: [0, 1.5, 0], // Rise up
                color: [
                    0.3 + Math.random() * 0.3,
                    0.6 + Math.random() * 0.4,
                    1.0,
                    1.0
                ],
                size: 3 + Math.random() * 3,
                life: 1.0,
                decay: 0.8,
                type: 'helix'
            });
        }
    }

    /**
     * Psychic energy orbs
     */
    emitPsychicOrbs(center, count) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 2;

            this.particles.push({
                position: [
                    center[0] + Math.cos(angle) * radius,
                    center[1] + 1,
                    center[2] + Math.sin(angle) * radius
                ],
                velocity: [
                    -Math.cos(angle) * 0.8, // Move inward
                    (Math.random() - 0.5) * 0.2,
                    -Math.sin(angle) * 0.8
                ],
                color: [
                    0.6 + Math.random() * 0.2,
                    0.3 + Math.random() * 0.3,
                    0.9 + Math.random() * 0.1,
                    1.0
                ],
                size: 5 + Math.random() * 8,
                life: 1.0,
                decay: 0.6,
                type: 'orb',
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    /**
     * Settling sparkles (gentle)
     */
    emitSettlingSparkles(center, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                position: [
                    center[0] + (Math.random() - 0.5) * 3,
                    center[1] + Math.random() * 3,
                    center[2] + (Math.random() - 0.5) * 3
                ],
                velocity: [
                    (Math.random() - 0.5) * 0.2,
                    -0.3 - Math.random() * 0.5, // Fall down
                    (Math.random() - 0.5) * 0.2
                ],
                color: [
                    1.0,
                    0.9 + Math.random() * 0.1,
                    0.5 + Math.random() * 0.5,
                    1.0
                ],
                size: 2 + Math.random() * 3,
                life: 1.0,
                decay: 0.7,
                type: 'settle'
            });
        }
    }

    /**
     * Update all particles
     */
    update(deltaTime) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.position[0] += p.velocity[0] * deltaTime;
            p.position[1] += p.velocity[1] * deltaTime;
            p.position[2] += p.velocity[2] * deltaTime;

            // Apply gravity for some types
            if (p.type === 'burst' || p.type === 'settle') {
                p.velocity[1] -= 9.8 * deltaTime * 0.2;
            }

            // Update life
            p.life -= p.decay * deltaTime;

            // Pulse effect for orbs
            if (p.type === 'orb') {
                p.pulse += deltaTime * 5;
                p.size = 5 + Math.sin(p.pulse) * 3;
            }

            // Twinkle for sparkles
            if (p.type === 'sparkle') {
                p.color[3] = 0.5 + Math.sin(p.life * 20) * 0.5;
            }

            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Limit particle count
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }
    }

    /**
     * Render particles
     */
    render(viewProjectionMatrix) {
        if (this.particles.length === 0) return;

        const gl = this.gl;

        // Prepare data arrays
        const positions = [];
        const colors = [];
        const sizes = [];

        for (const p of this.particles) {
            positions.push(...p.position);
            colors.push(...p.color.slice(0, 3)); // RGB only
            sizes.push(p.size * p.life); // Size fades with life
        }

        // Enable point rendering
        const oldPointSize = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);

        // Enable blending for particles
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive blending for glow

        // Upload data (implementation depends on your shader)
        // This is a simplified version - actual implementation needs proper shader support

        // Restore state
        gl.disable(gl.BLEND);
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }

    /**
     * Get particle count
     */
    getCount() {
        return this.particles.length;
    }
}
