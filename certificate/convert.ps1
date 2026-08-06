[void][Windows.Security.Cryptography.CryptographicBuffer, Windows.Security.Cryptography, ContentType=WindowsRuntime]
[void][Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime]
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
[void][Windows.Storage.Streams.IRandomAccessStream, Windows.Storage, ContentType=WindowsRuntime]

function Convert-PdfToPng {
    param(
        [string]$pdfPath,
        [string]$outputPath
    )
    
    try {
        $pdfPath = (Resolve-Path $pdfPath).Path
        $outputDir = [System.IO.Path]::GetDirectoryName($outputPath)
        $outputFileName = [System.IO.Path]::GetFileName($outputPath)
        
        # Get File Async
        $op = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)
        while ($op.Status -eq 'Started' -or $op.Status -eq 0) { Start-Sleep -Milliseconds 50 }
        $pdfFile = $op.GetResults()
        
        # Load PDF Document Async
        $op = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($pdfFile)
        while ($op.Status -eq 'Started' -or $op.Status -eq 0) { Start-Sleep -Milliseconds 50 }
        $pdfDoc = $op.GetResults()
        
        if ($pdfDoc.PageCount -gt 0) {
            $page = $pdfDoc.GetPage(0)
            
            # Get Output Folder Async
            $op = [Windows.Storage.StorageFolder]::GetFolderFromPathAsync($outputDir)
            while ($op.Status -eq 'Started' -or $op.Status -eq 0) { Start-Sleep -Milliseconds 50 }
            $outputFolder = $op.GetResults()
            
            # Create Output File Async
            $op = $outputFolder.CreateFileAsync($outputFileName, [Windows.Storage.CreationCollisionOption]::ReplaceExisting)
            while ($op.Status -eq 'Started' -or $op.Status -eq 0) { Start-Sleep -Milliseconds 50 }
            $outputFile = $op.GetResults()
            
            # Open stream Async
            $op = $outputFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)
            while ($op.Status -eq 'Started' -or $op.Status -eq 0) { Start-Sleep -Milliseconds 50 }
            $stream = $op.GetResults()
            
            # Render page to stream
            $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
            $pageSize = $page.Size
            # 3x DPI multiplier for high-quality HD text and graphics
            $options.DestinationWidth = [uint32]($pageSize.Width * 3)
            
            $op = $page.RenderToStreamAsync($stream, $options)
            while ($op.Status -eq 'Started' -or $op.Status -eq 0) { Start-Sleep -Milliseconds 50 }
            [void]$op.GetResults()
            
            # Flush stream Async
            $op = $stream.FlushAsync()
            while ($op.Status -eq 'Started' -or $op.Status -eq 0) { Start-Sleep -Milliseconds 50 }
            [void]$op.GetResults()
            
            $stream.Dispose()
            $page.Dispose()
            Write-Host "Successfully converted: $pdfPath -> $outputPath"
        } else {
            Write-Error "PDF has no pages: $pdfPath"
        }
    } catch {
        Write-Error "Failed to convert $pdfPath. Error: $_"
    }
}

$dataAnalyticsPdf = "c:\Users\Pankaj\Desktop\port\certificate\Pankaj Kumar Gautam Data Anaytics Bansal Soft Copy26.pdf"
$dataAnalyticsPng = "c:\Users\Pankaj\Desktop\port\certificate\data-analytics.png"

$pythonPdf = "c:\Users\Pankaj\Desktop\port\certificate\Pankaj Kumar Gautam Python Bansal Soft Copy26.pdf"
$pythonPng = "c:\Users\Pankaj\Desktop\port\certificate\python-fullstack.png"

Convert-PdfToPng -pdfPath $dataAnalyticsPdf -outputPath $dataAnalyticsPng
Convert-PdfToPng -pdfPath $pythonPdf -outputPath $pythonPng
