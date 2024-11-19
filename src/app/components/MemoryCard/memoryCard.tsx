import {
  formatTicksToTime,
  getBlobStorageUrl,
  parseTags,
} from "@/app/apiService/memory-apis";
import { Memory, MemoryCardProps } from "@/app/types";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Trash as TrashIcon } from "@phosphor-icons/react";
import React from "react";

const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onDelete,
  onView,
}) => {
  return (
    <Card sx={{ maxWidth: 400, my: 2, mx: 2, borderRadius: 4, boxShadow: 5 }}>
      <CardMedia
        onClick={() => onView(memory)}
        component="img"
        height="200"
        image={getBlobStorageUrl(memory.image.filePath)}
        alt={memory.image.fileName}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">
            {formatTicksToTime(memory.created_at)}
          </Typography>
          <Tooltip title="Delete Memory">
            <IconButton onClick={() => onDelete(memory.id)}>
              <TrashIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {memory.location}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {parseTags(memory.tags).map((tag: string, idx: number) => (
            <Chip key={idx} label={tag} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemoryCard;
