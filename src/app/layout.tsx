// Minimal root layout — locale-aware html/body shell is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children as React.ReactElement
}
