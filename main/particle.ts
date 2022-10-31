let block: HTMLElement | null;
const nbParticle = 25;

function checkPosition(particle: HTMLImageElement) {
    if (block) {
        const blockHeight = block.offsetHeight;
        const particleHeight = 20;
        const particlePos = (parseFloat(particle.style.top)/100) * blockHeight;
        const particleBottom = particlePos + particleHeight;

        if (particleBottom > blockHeight) {
            particle.style.top = `${particleBottom - blockHeight}px`
        }
    }
}

function setStartPostion(particle: HTMLImageElement) {
    if (block) {
        const width = block.offsetWidth

        switch (position) {
            case Position.right:
                particle.style.left = `${width}px`;
                break;
            default:
                particle.style.left = '0px'
        }
    }
}

function initParicle(type: TypeParticle = TypeParticle.moving) {
    const rnd = Math.random();

    let particle: HTMLImageElement;
    particle = document.createElement("img");
    particle.setAttribute("class", "particle");
    switch (type) {
        case TypeParticle.moving:
            if (block) {
                
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.left = '0px'
    
                setStartPostion(particle);
    
                if (rnd > 0.7) {
                    particle.src = 'images/flamme-1.webp'
                } else {
                    particle.src = 'images/flamme-2.webp'
                }
            }
            break;
        case TypeParticle.static:
            particle.style.top = `${Math.random() * 100}%`;

            switch(position) {
                case Position.right:
                    particle.style.left = `${100 - (Math.random() * 30)}%`;
                    break;
                default:
                    particle.style.left = `${Math.random() * 30}%`
            }

            if (rnd > 0.5) {
                particle.src = 'images/flamme-tempo-1.webp'
            } else {
                particle.src = 'images/flamme-tempo-2.webp'
            }
    }
    
    
    checkPosition(particle);

    return particle;
}

function generateParticle() {
    if (block) {
        const width = block.offsetWidth;
        const limit = width * 0.2;
        const particles: Array<HTMLImageElement> = [];

        setInterval(() => {
            particles.forEach((particle) => {
                const left = parseFloat(particle.style.left);

                switch (position) {
                    case Position.right:
                        particle.style.left = `${left - 5}px`;

                        if ( left < width - limit && Math.random() > 0.5 ) {
                            setStartPostion(particle);
                        } else if ( left <= 0 ) {
                            setStartPostion(particle);
                        }
                        break;
                    default:
                        console.log("here", particle.style.left, left)
                        particle.style.left = `${left + 5}px`;
                        console.log("here", particle.style.left, left)

                        if ( left > limit && Math.random() > 0.5 ) {
                            setStartPostion(particle);
                        } else if ( left >= width ) {
                            setStartPostion(particle);
                        }
                }
            })
        }, 100)

        let id = setInterval(
            () => {
                if (block) {
                    const particle = initParicle();
                    block.appendChild(particle);
                    particles.push(particle);

                    if (particles.length > nbParticle) {
                        clearInterval(id);
                    }
                }
            },
            150
        );
    }
}

function generateStaticParticle() {
    setInterval(() => {
        if (block) {
            const particle = initParicle(TypeParticle.static);

            block.appendChild(particle);

            setTimeout(() => {
                block && block.removeChild(particle);
            }, 1500)
        }
    }, 250)
}

window.addEventListener('load', () => {
    block = document.getElementById("block-container");
    if (block) {
        generateParticle();
        generateStaticParticle();
    }
})