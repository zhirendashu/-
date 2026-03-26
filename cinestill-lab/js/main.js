// ========================================
// 自定义光标
// ========================================
const cursor = document.querySelector('.cursor');
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// 悬停在可点击元素上时放大光标
const clickableElements = document.querySelectorAll('a, button, .btn');
clickableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursorGlow.style.width = '60px';
        cursorGlow.style.height = '60px';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorGlow.style.width = '40px';
        cursorGlow.style.height = '40px';
    });
});

// ========================================
// 平滑滚动
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// 导航栏滚动效果
// ========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // 添加背景模糊效果
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// 滚动动画 - Intersection Observer
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
const animatedElements = document.querySelectorAll('.project-card, .about-text, .about-visual, .contact-card, .stat-item');
animatedElements.forEach(el => observer.observe(el));

// ========================================
// 项目卡片悬停效果
// ========================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ========================================
// 技能标签随机颜色
// ========================================
const tags = document.querySelectorAll('.tag');
const accentColors = [
    'var(--accent-cyan)',
    'var(--accent-magenta)',
    'var(--accent-orange)',
    'var(--accent-purple)'
];

tags.forEach((tag, index) => {
    const color = accentColors[index % accentColors.length];
    tag.style.borderColor = color;
    tag.style.color = color;
    
    tag.addEventListener('mouseenter', () => {
        tag.style.background = color.replace('var(--accent-', 'rgba(').replace(')', ', 0.2)');
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.background = 'rgba(0, 245, 255, 0.1)';
    });
});

// ========================================
// 数字统计动画
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');

const animateNumber = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target === 1000 ? '+' : target === 3 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target === 1000 ? '+' : target === 3 ? '+' : '');
        }
    }, 16);
};

// 当统计数字进入视口时触发动画
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            if (text.includes('∞')) return;
            
            const number = parseInt(text.replace('+', ''));
            animateNumber(entry.target, number);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ========================================
// Hero 标题故障效果增强
// ========================================
const glitchText = document.querySelector('.glitch');

setInterval(() => {
    if (Math.random() > 0.95) {
        glitchText.style.textShadow = `
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 var(--accent-cyan),
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 var(--accent-magenta)
        `;
        
        setTimeout(() => {
            glitchText.style.textShadow = 'none';
        }, 50);
    }
}, 100);

// ========================================
// 渐变球体随机移动
// ========================================
const orbs = document.querySelectorAll('.gradient-orb');

orbs.forEach((orb, index) => {
    setInterval(() => {
        const randomX = Math.random() * 100 - 50;
        const randomY = Math.random() * 100 - 50;
        const randomScale = 0.8 + Math.random() * 0.4;
        
        orb.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
    }, 5000 + index * 1000);
});

// ========================================
// 页面加载动画
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// 移动端检测 - 禁用自定义光标
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    cursor.style.display = 'none';
    cursorGlow.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// ========================================
// 控制台彩蛋
// ========================================
console.log('%c👋 嘿!你好啊,开发者朋友!', 'font-size: 20px; font-weight: bold; color: #00f5ff;');
console.log('%c如果你对这个网站感兴趣,欢迎联系我: discobright@gmail.com', 'font-size: 14px; color: #a0a0a0;');
console.log('%c用 ❤️ 和 ☕ 制作 by 植人大树', 'font-size: 12px; color: #ff006e;');
