import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Folder, File } from "lucide-react";

export default function FilesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Files</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <span>Design Assets</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <span>Development</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <span>Documentation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
              <File className="h-5 w-5 text-muted-foreground" />
              <span>Project Requirements.pdf</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
              <File className="h-5 w-5 text-muted-foreground" />
              <span>Wireframes.fig</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
              <File className="h-5 w-5 text-muted-foreground" />
              <span>Technical Specs.docx</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 