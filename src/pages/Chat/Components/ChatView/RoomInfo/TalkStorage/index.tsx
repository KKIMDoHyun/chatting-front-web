import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/ui";

import { CloseButton } from "./CloseButton";
import { FileTab } from "./FileTab";
import { ImageTab } from "./ImageTab";
import { NoticeTab } from "./NoticeTab";
import { VideoTab } from "./VideoTab";

type TalkStorageProps = {
  roomId: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TalkStorage = ({
  roomId,
  isDrawerOpen,
  setIsDrawerOpen,
}: TalkStorageProps) => {
  return (
    <Drawer
      direction="right"
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
    >
      <DrawerContent
        position="right"
        className="flex h-full w-[500px] flex-col"
      >
        <div className="border-b">
          <DrawerHeader className="p-4">
            <DrawerTitle>톡서랍</DrawerTitle>
            <DrawerDescription>대화방의 콘텐츠를 모아봅니다.</DrawerDescription>
          </DrawerHeader>
        </div>

        <Tabs
          defaultValue="images"
          className="flex flex-grow flex-col overflow-hidden pb-3"
        >
          <TabsList className="w-full justify-between">
            <TabsTrigger value="images">사진</TabsTrigger>
            <TabsTrigger value="videos">동영상</TabsTrigger>
            <TabsTrigger value="files">파일</TabsTrigger>
            <TabsTrigger value="notices">공지사항</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="h-full overflow-auto p-2">
            <ImageTab roomId={roomId} />
          </TabsContent>
          <TabsContent value="videos" className="h-full overflow-auto p-2">
            <VideoTab roomId={roomId} />
          </TabsContent>
          <TabsContent value="files" className="h-full overflow-auto p-2">
            <FileTab roomId={roomId} />
          </TabsContent>
          <TabsContent value="notices" className="h-full overflow-auto p-2">
            <NoticeTab roomId={roomId} />
          </TabsContent>
        </Tabs>

        {isDrawerOpen && <CloseButton />}
      </DrawerContent>
    </Drawer>
  );
};
