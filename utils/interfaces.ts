export interface MulterField {
    /**
     * The field name.
     */
    name: string;
    /**
     * Optional maximum number of files per field to accept.
     */
    maxCount?: number;
}