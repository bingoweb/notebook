/**
 * Personal Blog - Interactive Features
 *
 * Features:
 * - Dark mode toggle with localStorage persistence
 * - Mobile navigation menu
 * - Search functionality
 * - Back to top button with smooth scroll
 * - Like functionality for posts
 * - Share functionality
 * - Scroll animations
 * - Intersection Observer for lazy animations
 */

// ========================
// Utility Functions
// ========================

/**
 * Debounce function to limit rate of function execution
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get from localStorage with fallback
 */
function getLocalStorage(key, fallback = null) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : fallback;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return fallback;
    }
}

/**
 * Set to localStorage with error handling
 */
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

// ========================
// Theme Management
// ========================

class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.sunIcon = document.querySelector('.sun-icon');
        this.moonIcon = document.querySelector('.moon-icon');
        this.currentTheme = getLocalStorage('theme', 'light');

        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);

        // Add event listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateIcons(theme);
        setLocalStorage('theme', theme);
        this.currentTheme = theme;
    }

    updateIcons(theme) {
        if (!this.sunIcon || !this.moonIcon) return;

        if (theme === 'dark') {
            this.sunIcon.style.display = 'none';
            this.moonIcon.style.display = 'block';
        } else {
            this.sunIcon.style.display = 'block';
            this.moonIcon.style.display = 'none';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);

        // Add subtle animation feedback
        document.body.style.transition = 'background-color 0.3s ease';
    }
}

// ========================
// Mobile Navigation
// ========================

class MobileNav {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navMenu) return;

        // Toggle menu
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.site-nav')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('active');
    }
}

// ========================
// Search Functionality
// ========================

class SearchManager {
    constructor() {
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchBar = document.querySelector('.search-bar');
        this.searchInput = document.querySelector('.search-input');
        this.searchClose = document.querySelector('.search-close');
        this.posts = document.querySelectorAll('.post');

        this.init();
    }

    init() {
        if (!this.searchToggle || !this.searchBar) return;

        // Toggle search bar
        this.searchToggle.addEventListener('click', () => this.openSearch());

        // Close search
        if (this.searchClose) {
            this.searchClose.addEventListener('click', () => this.closeSearch());
        }

        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', debounce((e) => {
                this.performSearch(e.target.value);
            }, 300));
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.searchBar.hidden) {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        this.searchBar.hidden = false;
        this.searchInput.focus();
    }

    closeSearch() {
        this.searchBar.hidden = true;
        this.searchInput.value = '';
        this.performSearch(''); // Reset search
    }

    performSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        this.posts.forEach(post => {
            const title = post.querySelector('h2')?.textContent.toLowerCase() || '';
            const content = post.querySelector('.post-content')?.textContent.toLowerCase() || '';
            const tags = Array.from(post.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');

            const matches = !searchTerm ||
                title.includes(searchTerm) ||
                content.includes(searchTerm) ||
                tags.includes(searchTerm);

            if (matches) {
                post.style.display = '';
                post.style.animation = 'fadeInUp 0.4s ease-out';
            } else {
                post.style.display = 'none';
            }
        });

        // Show "no results" message if needed
        const visiblePosts = Array.from(this.posts).filter(post => post.style.display !== 'none');
        if (searchTerm && visiblePosts.length === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
        }
    }

    showNoResults() {
        const existing = document.querySelector('.no-results');
        if (existing) return;

        const message = document.createElement('div');
        message.className = 'no-results';
        message.style.textAlign = 'center';
        message.style.padding = '2rem';
        message.style.color = 'var(--text-muted)';
        message.innerHTML = '<p>Aradığınız kriterlere uygun sonuç bulunamadı.</p>';

        const postsGrid = document.querySelector('.posts-grid');
        if (postsGrid) {
            postsGrid.appendChild(message);
        }
    }

    hideNoResults() {
        const message = document.querySelector('.no-results');
        if (message) {
            message.remove();
        }
    }
}

// ========================
// Back to Top Button
// ========================

class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        this.init();
    }

    init() {
        if (!this.button) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', debounce(() => {
            this.toggleVisibility();
        }, 100));

        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.hidden = false;
        } else {
            this.button.hidden = true;
        }
    }
}

// ========================
// Like Functionality
// ========================

class LikeManager {
    constructor() {
        this.likeButtons = document.querySelectorAll('.like-btn');
        this.likes = getLocalStorage('post-likes', {});

        this.init();
    }

    init() {
        this.likeButtons.forEach((button, index) => {
            const postId = `post-${index}`;
            const likeCount = this.likes[postId] || 0;

            // Set initial state
            this.updateButton(button, likeCount);

            // Add click handler
            button.addEventListener('click', () => {
                this.toggleLike(button, postId);
            });
        });
    }

    updateButton(button, count) {
        const countSpan = button.querySelector('.like-count');
        if (countSpan) {
            countSpan.textContent = count;
        }

        if (count > 0) {
            button.classList.add('liked');
        } else {
            button.classList.remove('liked');
        }
    }

    toggleLike(button, postId) {
        const currentLikes = this.likes[postId] || 0;
        const newLikes = currentLikes > 0 ? 0 : 1;

        this.likes[postId] = newLikes;
        setLocalStorage('post-likes', this.likes);

        // Update UI with animation
        this.updateButton(button, newLikes);

        // Add animation feedback
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }
}

// ========================
// Share Functionality
// ========================

class ShareManager {
    constructor() {
        this.shareButtons = document.querySelectorAll('.share-btn');
        this.init();
    }

    init() {
        this.shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.share(e.currentTarget);
            });
        });
    }

    async share(button) {
        const post = button.closest('.post');
        const title = post.querySelector('h2')?.textContent || 'Blog Yazısı';
        const text = post.querySelector('.post-content p')?.textContent || '';

        const shareData = {
            title: title,
            text: text,
            url: window.location.href
        };

        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                this.showFeedback(button, 'Paylaşıldı!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                    this.fallbackShare(shareData, button);
                }
            }
        } else {
            this.fallbackShare(shareData, button);
        }
    }

    fallbackShare(data, button) {
        // Copy URL to clipboard
        const url = data.url;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showFeedback(button, 'Link kopyalandı!');
            }).catch(() => {
                this.showFeedback(button, 'Paylaşılamadı');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                this.showFeedback(button, 'Link kopyalandı!');
            } catch (error) {
                this.showFeedback(button, 'Paylaşılamadı');
            }

            document.body.removeChild(textArea);
        }
    }

    showFeedback(button, message) {
        const tooltip = document.createElement('span');
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--accent-primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.85rem;
            white-space: nowrap;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        `;

        button.style.position = 'relative';
        button.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 2000);
    }
}

// ========================
// Intersection Observer for Animations
// ========================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) return;

        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe posts
        document.querySelectorAll('.post').forEach(post => {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            post.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(post);
        });
    }
}

// ========================
// Active Navigation Link
// ========================

class ActiveNav {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                this.navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                e.target.classList.add('active');
            });
        });
    }
}

// ========================
// Performance Monitoring
// ========================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log performance metrics
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;

                    console.log('📊 Performance Metrics:');
                    console.log(`  Page Load Time: ${pageLoadTime}ms`);
                    console.log(`  DOM Ready Time: ${domReadyTime}ms`);
                }, 0);
            });
        }
    }
}

// ========================
// Initialize All Features
// ========================

function initializeBlog() {
    console.log('🚀 Initializing Personal Blog...');

    try {
        // Initialize all features
        new ThemeManager();
        new MobileNav();
        new SearchManager();
        new BackToTop();
        new LikeManager();
        new ShareManager();
        new ScrollAnimations();
        new ActiveNav();
        new PerformanceMonitor();

        console.log('✅ Blog initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing blog:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
    initializeBlog();
}

// ========================
// Service Worker Registration (Progressive Web App)
// ========================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Note: Implement service-worker.js if PWA features are needed
        // navigator.serviceWorker.register('/service-worker.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.error('Service Worker registration failed'));
    });
}

// Export for use in modules (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        MobileNav,
        SearchManager,
        BackToTop,
        LikeManager,
        ShareManager
    };
}
