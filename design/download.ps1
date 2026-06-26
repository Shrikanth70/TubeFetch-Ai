$screens = @(
    @{
        name = "Home"
        url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE3YjVmYjA0ZjljZjQ0NDE5MzRhM2U0ZWMwYzljNjMyEgsSBxDYydbOmA4YAZIBIwoKcHJvamVjdF9pZBIVQhMxMzg2ODc4Mjc5MzI2MjU2Mzkx&filename=&opi=89354086"
        imgUrl = "https://lh3.googleusercontent.com/aida/AP1WRLs_HuIDtxlBNhoieDa2TIrncfkB4WzcOA7A3aQ7AtHZCFhpgVKDBCc3_kdKALCWnOfXSoM0oDl_GTowA1f1gM1Ws3lb-OC68OmfV0c8kszfU37nLQk-2NO_di53Eh4cgk1IhX6l1cFc12aop_UjeoJH-LlNjnRzRSZYP4F-sxLyE9dYStHyyMx9Coh0SLCyFV_f8KhhQKSJiRef0Sv-qveSNTYarfjCv8itd7MjTmYvT1OfTZSA1u6pFic"
    },
    @{
        name = "Video_Preview"
        url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzEwNDQ3NTg4YmQwNzQwMmE4Y2IyMWJjYmJkOGY4Y2FiEgsSBxDYydbOmA4YAZIBIwoKcHJvamVjdF9pZBIVQhMxMzg2ODc4Mjc5MzI2MjU2Mzkx&filename=&opi=89354086"
        imgUrl = "https://lh3.googleusercontent.com/aida/AP1WRLsePTfo2K40ae_gqvhhkkNoEybRJLAAAHaLYFAWPfHpBbLgxHV2Hp3pF3H93VDEunVTdBPCPrabH9rly-M2kjFK70rq_aDttQBwpGyVoz-UXBDRYCi11rGk8_JZ5dx1YOjO32QFga2fRTmlH0JtQBmBFOpSM_X71SjlHUTa6Ctgd0phRmBJ6M8TKPcypQ9cvhaCpgklwvJimHiM81POGKFH8nTl6Q_hS_8I-D0V2wLgcZ1JvdbYOP-UrMI"
    },
    @{
        name = "Download_Status"
        url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc5NTczYmIwZmNmNDQ2MzM5NTZiODYxZWZhOTk0YjI4EgsSBxDYydbOmA4YAZIBIwoKcHJvamVjdF9pZBIVQhMxMzg2ODc4Mjc5MzI2MjU2Mzkx&filename=&opi=89354086"
        imgUrl = "https://lh3.googleusercontent.com/aida/AP1WRLsoGg2yP7IzjZWnwoUrhkfIp8p0TXno4rMHuAsVDodirOC_2UQ1E649q4sRK3YmuUwhUqcqIuUMUqDwspvuRGxcMMdgLHPR3BYyyjwhG5PJuJKnP27e-7gA1DUtn4MDumSfXVluTnTJGrgVnajjsDKa8MgJFhfs4Ke0lmjsrShP7RtzFRY4bao3BVsuiOLoa_xaU_Wira_O6_2Jtcrv0chb4OTzU0BmBePIm4pfPUbL6_HQbDNUlRv5YA"
    },
    @{
        name = "History"
        url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Y0ZTU1NTQ1OTc2YTQwMjdiYmU2ZWM2MTc5YTBiOWRmEgsSBxDYydbOmA4YAZIBIwoKcHJvamVjdF9pZBIVQhMxMzg2ODc4Mjc5MzI2MjU2Mzkx&filename=&opi=89354086"
        imgUrl = "https://lh3.googleusercontent.com/aida/AP1WRLvohSAMA4aMT0R7mYuMzRaJikSK76QqAaKM5pMWljYc4_OoJFYa8XbfPFFzuEWgLZH8TWqQCpP1VajR2Qm_HTOpka3HDuT7waufK54VoChZ9Ix14N3slQNWONWSvQ8P-F_XtFr8252S-gU68Kx2JoYAM5oUfOBr9Hup1SuGSwBKrpGUMIWr61hktjJg-bJEX4j8-Hhfr9OecPDHEBZkL9s24SimkakFiyrjpv5GvifRVcuvHo4iTPdTOfY"
    }
)

foreach ($screen in $screens) {
    Write-Host "Downloading $($screen.name)..."
    try {
        Invoke-WebRequest -Uri $screen.url -OutFile "design/$($screen.name).html" -UseBasicParsing
        Invoke-WebRequest -Uri $screen.imgUrl -OutFile "design/$($screen.name).png" -UseBasicParsing
        Write-Host "  OK: $($screen.name)"
    } catch {
        Write-Host "  FAILED: $_"
    }
}

Write-Host "Done."
