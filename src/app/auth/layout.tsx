export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(/assets/authbg.png)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
            }}
        >
            {children}
        </div>
    )
}
