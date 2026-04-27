const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardNav.tsx', 'utf-8');

// Move SectionLabel and NavItem out
const sectionLabelRegex = /const SectionLabel = \(\{ label \}: \{ label: string \}\) => \([\s\S]*?\);\n/m;
const navItemRegex = /const NavItem = \(\{ href, icon, label \}: \{ href: string, icon: React\.ReactNode, label: string \}\) => \([\s\S]*?\);\n/m;

const sectionLabelMatch = code.match(sectionLabelRegex);
const navItemMatch = code.match(navItemRegex);

if (sectionLabelMatch && navItemMatch) {
  code = code.replace(sectionLabelMatch[0], '');
  code = code.replace(navItemMatch[0], '');
  
  const newSectionLabel = `const SectionLabel = ({ label }: { label: string }) => (
  <div className="nav-section-label">
    {label}
  </div>
);

`;
  const newNavItem = `const NavItem = ({ href, icon, label, isActive, onClick }: { href: string, icon: React.ReactNode, label: string, isActive: boolean, onClick?: () => void }) => (
  <Link 
    href={href} 
    className={\`nav-item \${isActive ? 'active' : ''}\`}
    onClick={onClick}
  >
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </Link>
);

`;

  // Insert at top after imports
  code = code.replace('export default function DashboardNav', newSectionLabel + newNavItem + 'export default function DashboardNav');
  
  // Replace <NavItem ... />
  code = code.replace(/<NavItem href=(["'])(.*?)\1(.*?)\/>/g, (match, q, href, rest) => {
    return `<NavItem href="${href}"${rest}isActive={isActive("${href}")} onClick={onNavClick} />`;
  });
  
  fs.writeFileSync('src/components/DashboardNav.tsx', code);
  console.log('Fixed DashboardNav.tsx');
} else {
  console.log('Regex failed');
}
